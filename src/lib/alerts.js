import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Buyer deal-alert signups. Table (optional — falls back to localStorage):
 *   create table if not exists alert_signups (
 *     id bigint generated always as identity primary key,
 *     email text not null, state text, created_at timestamptz default now());
 *   alter table alert_signups enable row level security;
 *   create policy "anon alerts" on alert_signups for insert with check (true);
 */
export async function signupForAlerts(email, state) {
  const clean = (email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return { ok: false, reason: 'invalid' };
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('alert_signups').insert({ email: clean, state: state || null });
    if (!error) return { ok: true };
  }
  try {
    const list = JSON.parse(localStorage.getItem('asl-alert-signups-v1') || '[]');
    list.push({ email: clean, state, ts: new Date().toISOString() });
    localStorage.setItem('asl-alert-signups-v1', JSON.stringify(list));
  } catch { /* ignore */ }
  return { ok: true };
}
