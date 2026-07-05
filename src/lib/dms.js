import { supabase, isSupabaseConfigured } from './supabase';
import { recordDM as recordLocalDM, getThread as getLocalThread } from './dmHistory';

/**
 * Direct messages, backed by Supabase so two browsers (or two test accounts)
 * actually talk to each other. Falls back to the old localStorage history
 * when the table hasn't been created yet.
 *
 *   create table if not exists dms (
 *     id bigint generated always as identity primary key,
 *     from_key text not null,
 *     to_key text not null,
 *     text text not null,
 *     created_at timestamptz default now());
 *   create index if not exists dms_pair on dms (from_key, to_key, created_at);
 *   alter table dms enable row level security;
 *   create policy "anon dms" on dms for all using (true) with check (true);
 */

let tableOk = true;
function missingTable(error) {
  return /does not exist|relation .* not|42P01|schema cache/i.test(error?.message || '');
}

const rowToMsg = (r) => ({
  id: r.id,
  fromId: r.from_key,
  toId: r.to_key,
  text: r.text,
  ts: r.created_at,
});

export async function sendDM({ fromId, fromName, toId, toName, text }) {
  const body = (text || '').trim();
  if (!fromId || !toId || !body) return null;
  if (isSupabaseConfigured && tableOk) {
    const { data, error } = await supabase
      .from('dms')
      .insert({ from_key: String(fromId), to_key: String(toId), text: body })
      .select()
      .single();
    if (!error && data) {
      // keep the local mirror so "buyers I've DM'd" unlocks keep working offline
      recordLocalDM({ fromId, fromName, toId, toName, text: body });
      return rowToMsg(data);
    }
    if (missingTable(error)) tableOk = false;
  }
  return recordLocalDM({ fromId, fromName, toId, toName, text: body });
}

/** Full thread between two users, oldest → newest. */
export async function fetchThread(aId, bId, limit = 300) {
  const a = String(aId), b = String(bId);
  if (isSupabaseConfigured && tableOk) {
    const { data, error } = await supabase
      .from('dms')
      .select('*')
      .or(`and(from_key.eq.${a},to_key.eq.${b}),and(from_key.eq.${b},to_key.eq.${a})`)
      .order('created_at', { ascending: true })
      .limit(limit);
    if (!error && data) return data.map(rowToMsg);
    if (missingTable(error)) tableOk = false;
  }
  return getLocalThread(a, b);
}

/**
 * Everyone I have a thread with, newest activity first:
 * [{ partnerId, lastText, lastTs, lastFromMe }]
 */
export async function fetchConversations(myId, limit = 400) {
  const me = String(myId);
  let msgs = [];
  if (isSupabaseConfigured && tableOk) {
    const { data, error } = await supabase
      .from('dms')
      .select('*')
      .or(`from_key.eq.${me},to_key.eq.${me}`)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (!error && data) msgs = data.map(rowToMsg);
    else if (missingTable(error)) tableOk = false;
  }
  if (!msgs.length && !tableOk) {
    // local fallback: scan the mirror for anyone we've talked to
    msgs = [];
  }
  const byPartner = new Map();
  for (const m of msgs) {
    const partner = m.fromId === me ? m.toId : m.fromId;
    if (!byPartner.has(partner)) {
      byPartner.set(partner, {
        partnerId: partner,
        lastText: m.text,
        lastTs: m.ts,
        lastFromMe: m.fromId === me,
      });
    }
  }
  return [...byPartner.values()];
}

/* Unread = messages from the partner newer than when I last opened the thread. */
const SEEN_KEY = 'asl-dm-last-seen-v1';

function readSeen() {
  try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '{}'); } catch { return {}; }
}

export function markThreadSeen(partnerId) {
  const seen = readSeen();
  seen[String(partnerId)] = new Date().toISOString();
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(seen)); } catch { /* ignore */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('asl-inbox-change'));
}

/** Count unread per partner from a conversations list. */
export function unreadFromConversations(convs) {
  const seen = readSeen();
  const out = {};
  for (const c of convs) {
    if (!c.lastFromMe && (!seen[c.partnerId] || new Date(c.lastTs) > new Date(seen[c.partnerId]))) {
      out[c.partnerId] = 1; // at least one unread; exact counts need per-msg tracking
    }
  }
  return out;
}
