/**
 * Inbox state (localStorage) — unread badges, user-started threads, and the
 * follow graph. Fires 'asl-inbox-change' on every write so the Navbar and
 * mobile tab bar badges update live.
 *
 * Unread counts are seeded once from the demo conversations, then owned
 * here: opening a conversation clears its count everywhere.
 */

const UNREAD_KEY = 'asl-inbox-unread-v1';
const THREADS_KEY = 'asl-inbox-threads-v1'; // user-started DM threads [{userId, startedAt}]
const FOLLOW_KEY = 'asl-following-v1';

// conversation id → unread count (matches the seeded demo inbox)
const UNREAD_SEED = { 1: 3, 2: 1 };
const FOLLOW_SEED = [2, 4, 'admin-carson'];

function emit() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('asl-inbox-change'));
}

function read(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  emit();
}

/* ── Unread ── */

export function getUnreadMap() {
  const stored = read(UNREAD_KEY, null);
  if (stored) return stored;
  write(UNREAD_KEY, UNREAD_SEED);
  return { ...UNREAD_SEED };
}

export function unreadFor(convId) {
  return getUnreadMap()[convId] || 0;
}

export function totalUnread() {
  return Object.values(getUnreadMap()).reduce((a, b) => a + (b || 0), 0);
}

export function markConversationRead(convId) {
  const map = getUnreadMap();
  if (!map[convId]) return;
  delete map[convId];
  write(UNREAD_KEY, map);
}

export function bumpUnread(convId, by = 1) {
  const map = getUnreadMap();
  map[convId] = (map[convId] || 0) + by;
  write(UNREAD_KEY, map);
}

/* ── Buyer leads (the "My Buyers" tab) ── */

const BUYERS_SEEN_KEY = 'asl-buyers-seen-v1';

/** Requests/leads count as new until the wholesaler opens the My Buyers tab. */
export function newBuyerCount(leadIds) {
  const seen = new Set(read(BUYERS_SEEN_KEY, []));
  return leadIds.filter(id => !seen.has(id)).length;
}

export function markBuyersSeen(leadIds) {
  const seen = new Set(read(BUYERS_SEEN_KEY, []));
  leadIds.forEach(id => seen.add(id));
  write(BUYERS_SEEN_KEY, [...seen]);
}

/* ── User-started threads (Message Seller → real thread in the list) ── */

export function getStartedThreads() {
  return read(THREADS_KEY, []);
}

export function ensureThread(userId) {
  const list = getStartedThreads();
  if (!list.some(t => String(t.userId) === String(userId))) {
    list.unshift({ userId, startedAt: new Date().toISOString() });
    write(THREADS_KEY, list);
  }
  return list;
}

/* ── Following ── */

export function getFollowing() {
  const stored = read(FOLLOW_KEY, null);
  if (stored) return stored;
  write(FOLLOW_KEY, FOLLOW_SEED);
  return [...FOLLOW_SEED];
}

export function isFollowing(userId) {
  return getFollowing().some(id => String(id) === String(userId));
}

export function toggleFollow(userId) {
  const list = getFollowing();
  const idx = list.findIndex(id => String(id) === String(userId));
  if (idx >= 0) list.splice(idx, 1);
  else list.push(userId);
  write(FOLLOW_KEY, list);
  return idx < 0;
}

/* ── React helper ── */

export function subscribeInbox(cb) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('asl-inbox-change', cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener('asl-inbox-change', cb);
    window.removeEventListener('storage', cb);
  };
}
