/**
 * Super-admin moderation state (localStorage). banUser / timeoutUser /
 * clearUser / getStatus. Per-browser prototype; ready to move to a
 * `moderation` table later.
 */
import { logActivity } from './activityLog';

const KEY = 'asl-moderation-v1';

function read() {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
  catch { return {}; }
}
function write(map) {
  try { localStorage.setItem(KEY, JSON.stringify(map)); } catch { /* ignore */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('asl-moderation-change'));
}

/** { banned:boolean, timedOutUntil:ISOstring|null, reason:string } */
export function getStatus(userId) {
  const m = read()[String(userId)] || {};
  const timedOut = m.timedOutUntil && new Date(m.timedOutUntil) > new Date();
  return {
    banned: !!m.banned,
    timedOut: !!timedOut,
    timedOutUntil: timedOut ? m.timedOutUntil : null,
    reason: m.reason || '',
    restricted: !!m.banned || !!timedOut,
  };
}

export function banUser(userId, by, reason = '') {
  const map = read();
  map[String(userId)] = { ...(map[String(userId)] || {}), banned: true, reason };
  write(map);
  logActivity({ actorId: by?.id || 'super-admin', actorName: by?.name || 'Super Admin', type: 'ban', detail: reason || 'Account banned', targetId: userId });
}

export function timeoutUser(userId, days, by, reason = '') {
  const until = new Date(Date.now() + days * 86400000).toISOString();
  const map = read();
  map[String(userId)] = { ...(map[String(userId)] || {}), timedOutUntil: until, reason };
  write(map);
  logActivity({ actorId: by?.id || 'super-admin', actorName: by?.name || 'Super Admin', type: 'timeout', detail: `${days}-day timeout${reason ? ` — ${reason}` : ''}`, targetId: userId });
}

export function clearUser(userId, by) {
  const map = read();
  delete map[String(userId)];
  write(map);
  logActivity({ actorId: by?.id || 'super-admin', actorName: by?.name || 'Super Admin', type: 'moderation_clear', detail: 'Restrictions lifted', targetId: userId });
}
