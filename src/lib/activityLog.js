/**
 * Lightweight activity log (localStorage). Records what users do so the
 * Super Admin can audit it. No backend yet, so this is per-browser; the
 * shape is ready to swap to a Supabase `activity` table later.
 *
 *   logActivity({ actorId, actorName, type, detail, targetId })
 *   getActivityForUser(userId)   → newest-first list where they're the actor
 *   getAllActivity()             → everything, newest first
 */
const KEY = 'asl-activity-log-v1';
const MAX = 2000;

function read() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX))); } catch { /* ignore */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('asl-activity-change'));
}

export function logActivity({ actorId, actorName, type, detail = '', targetId = null }) {
  if (!actorId || !type) return;
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: new Date().toISOString(),
    actorId: String(actorId),
    actorName: actorName || String(actorId),
    type,                 // e.g. deal_create, deal_edit, dm_sent, dm_received, address_request, ban, timeout
    detail,
    targetId: targetId != null ? String(targetId) : null,
  };
  const list = read();
  list.unshift(entry);
  write(list);
  return entry;
}

export function getActivityForUser(userId) {
  const uid = String(userId);
  return read().filter(e => e.actorId === uid || e.targetId === uid);
}

export function getAllActivity() {
  return read();
}
