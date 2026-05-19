/**
 * DM history (localStorage). Enough to (a) power the address-request DM
 * popup and (b) let a deal's "buyers I've DM'd before" auto-approve rule
 * check whether the seller has messaged a given buyer.
 *
 *   recordDM({ fromId, fromName, toId, text })
 *   getThread(aId, bId)  → chronological messages between the two
 *   hasDMd(fromId, toId) → has `fromId` ever sent `toId` a message?
 */
import { logActivity } from './activityLog';

const KEY = 'asl-dm-history-v1';

function read() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list.slice(-5000))); } catch { /* ignore */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('asl-dm-change'));
}

export function recordDM({ fromId, fromName, toId, toName, text }) {
  if (!fromId || !toId || !text?.trim()) return;
  const msg = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ts: new Date().toISOString(),
    fromId: String(fromId),
    toId: String(toId),
    text: text.trim(),
  };
  const list = read();
  list.push(msg);
  write(list);
  logActivity({ actorId: fromId, actorName: fromName, type: 'dm_sent', detail: text.trim().slice(0, 80), targetId: toId });
  logActivity({ actorId: toId, actorName: toName, type: 'dm_received', detail: `from ${fromName || fromId}: ${text.trim().slice(0, 60)}`, targetId: fromId });
  return msg;
}

export function getThread(aId, bId) {
  const a = String(aId), b = String(bId);
  return read()
    .filter(m => (m.fromId === a && m.toId === b) || (m.fromId === b && m.toId === a))
    .sort((x, y) => new Date(x.ts) - new Date(y.ts));
}

export function hasDMd(fromId, toId) {
  const f = String(fromId), t = String(toId);
  return read().some(m => m.fromId === f && m.toId === t);
}
