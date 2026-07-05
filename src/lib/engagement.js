import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Real engagement tracking — views + hearts per deal, backed by Supabase.
 *
 *   deal_views  (deal_id, user_key) primary key → one user counts ONCE, ever
 *   deal_hearts (deal_id, user_key) primary key → who hearted what, toggleable
 *
 * user_key = the signed-in account id, or a stable anonymous device id for
 * guests, so view counts stay honest either way. If the tables don't exist
 * yet (migration below not run), everything degrades to localStorage so the
 * UI never breaks:
 *
 *   create table if not exists deal_views (
 *     deal_id text not null, user_key text not null,
 *     created_at timestamptz default now(), primary key (deal_id, user_key));
 *   create table if not exists deal_hearts (
 *     deal_id text not null, user_key text not null,
 *     created_at timestamptz default now(), primary key (deal_id, user_key));
 *   alter table deal_views enable row level security;
 *   alter table deal_hearts enable row level security;
 *   create policy "anon views" on deal_views for all using (true) with check (true);
 *   create policy "anon hearts" on deal_hearts for all using (true) with check (true);
 */

const DEVICE_KEY = 'asl-device-key-v1';
const LOCAL_VIEWS = 'asl-local-views-v1';   // fallback { dealId: [userKey] }
const LOCAL_HEARTS = 'asl-local-hearts-v1'; // fallback { dealId: [userKey] }

let viewsTableOk = true;   // flips false on "relation does not exist"
let heartsTableOk = true;

/** Stable per-browser key for guests; signed-in users pass their account id. */
export function deviceKey() {
  if (typeof window === 'undefined') return 'server';
  try {
    let k = localStorage.getItem(DEVICE_KEY);
    if (!k) {
      k = `dev_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      localStorage.setItem(DEVICE_KEY, k);
    }
    return k;
  } catch {
    return 'dev_private';
  }
}

export function userKey(currentUser) {
  return currentUser?.id != null ? `u_${currentUser.id}` : deviceKey();
}

function missingTable(error) {
  return /does not exist|relation .* not|42P01|schema cache/i.test(error?.message || '');
}

function localRead(key) {
  try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
}
function localWrite(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

/* ── Views ── */

/** Count a view exactly once per user per deal. Returns nothing useful. */
export async function recordView(dealId, currentUser) {
  const key = userKey(currentUser);
  const id = String(dealId);
  if (isSupabaseConfigured && viewsTableOk) {
    const { error } = await supabase
      .from('deal_views')
      .upsert({ deal_id: id, user_key: key }, { onConflict: 'deal_id,user_key', ignoreDuplicates: true });
    if (!error) return;
    if (missingTable(error)) viewsTableOk = false;
  }
  // Fallback: localStorage (per-device truth only)
  const all = localRead(LOCAL_VIEWS);
  const set = new Set(all[id] || []);
  set.add(key);
  all[id] = [...set];
  localWrite(LOCAL_VIEWS, all);
}

/** Unique-view count for one deal. */
export async function getViewCount(dealId) {
  const id = String(dealId);
  if (isSupabaseConfigured && viewsTableOk) {
    const { count, error } = await supabase
      .from('deal_views')
      .select('*', { count: 'exact', head: true })
      .eq('deal_id', id);
    if (!error) return count || 0;
    if (missingTable(error)) viewsTableOk = false;
  }
  return (localRead(LOCAL_VIEWS)[id] || []).length;
}

/** View counts for many deals at once: { dealId: n }. */
export async function getViewCounts(dealIds) {
  const ids = dealIds.map(String);
  if (!ids.length) return {};
  if (isSupabaseConfigured && viewsTableOk) {
    const { data, error } = await supabase
      .from('deal_views')
      .select('deal_id')
      .in('deal_id', ids);
    if (!error && data) {
      const out = {};
      for (const row of data) out[row.deal_id] = (out[row.deal_id] || 0) + 1;
      return out;
    }
    if (missingTable(error)) viewsTableOk = false;
  }
  const all = localRead(LOCAL_VIEWS);
  const out = {};
  for (const id of ids) out[id] = (all[id] || []).length;
  return out;
}

/* ── Hearts ── */

/** Toggle a heart; resolves to the new state { hearted, count }. */
export async function toggleHeart(dealId, currentUser) {
  const key = userKey(currentUser);
  const id = String(dealId);
  if (isSupabaseConfigured && heartsTableOk) {
    const { data: existing, error: readErr } = await supabase
      .from('deal_hearts')
      .select('user_key')
      .eq('deal_id', id)
      .eq('user_key', key)
      .maybeSingle();
    if (!readErr || !missingTable(readErr)) {
      if (existing) {
        await supabase.from('deal_hearts').delete().eq('deal_id', id).eq('user_key', key);
      } else {
        await supabase.from('deal_hearts').insert({ deal_id: id, user_key: key });
      }
      const count = await getHeartCount(id);
      return { hearted: !existing, count };
    }
    heartsTableOk = false;
  }
  const all = localRead(LOCAL_HEARTS);
  const set = new Set(all[id] || []);
  const hearted = !set.has(key);
  if (hearted) set.add(key); else set.delete(key);
  all[id] = [...set];
  localWrite(LOCAL_HEARTS, all);
  return { hearted, count: set.size };
}

export async function getHeartCount(dealId) {
  const id = String(dealId);
  if (isSupabaseConfigured && heartsTableOk) {
    const { count, error } = await supabase
      .from('deal_hearts')
      .select('*', { count: 'exact', head: true })
      .eq('deal_id', id);
    if (!error) return count || 0;
    if (missingTable(error)) heartsTableOk = false;
  }
  return (localRead(LOCAL_HEARTS)[id] || []).length;
}

export async function hasHearted(dealId, currentUser) {
  const key = userKey(currentUser);
  const id = String(dealId);
  if (isSupabaseConfigured && heartsTableOk) {
    const { data, error } = await supabase
      .from('deal_hearts')
      .select('user_key')
      .eq('deal_id', id)
      .eq('user_key', key)
      .maybeSingle();
    if (!error) return !!data;
    if (missingTable(error)) heartsTableOk = false;
  }
  return (localRead(LOCAL_HEARTS)[id] || []).includes(key);
}

/** Heart counts for many deals: { dealId: n }. */
export async function getHeartCounts(dealIds) {
  const ids = dealIds.map(String);
  if (!ids.length) return {};
  if (isSupabaseConfigured && heartsTableOk) {
    const { data, error } = await supabase
      .from('deal_hearts')
      .select('deal_id')
      .in('deal_id', ids);
    if (!error && data) {
      const out = {};
      for (const row of data) out[row.deal_id] = (out[row.deal_id] || 0) + 1;
      return out;
    }
    if (missingTable(error)) heartsTableOk = false;
  }
  const all = localRead(LOCAL_HEARTS);
  const out = {};
  for (const id of ids) out[id] = (all[id] || []).length;
  return out;
}
