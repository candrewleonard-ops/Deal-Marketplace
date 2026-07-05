/**
 * Live Real Estate Tours — sessions + follower-notification preferences.
 *
 * Notifications default ON for everyone following a wholesaler; viewers can
 * turn them off globally or mute specific hosts (Settings on the Live page).
 */

export const liveNow = [];

export const upcomingTours = [];

export function getLiveSession(id) {
  return liveNow.find(s => s.id === id) || null;
}

/* ── Follower notification preferences (default ON) ── */

const PREFS_KEY = 'asl-live-notif-prefs-v1';

export function getLiveNotifPrefs() {
  if (typeof window === 'undefined') return { enabled: true, muted: [] };
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? JSON.parse(raw) : { enabled: true, muted: [] };
  } catch { return { enabled: true, muted: [] }; }
}

function writePrefs(prefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('asl-inbox-change'));
}

export function setLiveNotifsEnabled(enabled) {
  writePrefs({ ...getLiveNotifPrefs(), enabled });
}

export function toggleMuteHost(hostId) {
  const prefs = getLiveNotifPrefs();
  const muted = prefs.muted.some(id => String(id) === String(hostId))
    ? prefs.muted.filter(id => String(id) !== String(hostId))
    : [...prefs.muted, hostId];
  writePrefs({ ...prefs, muted });
}

export function isHostMuted(hostId) {
  return getLiveNotifPrefs().muted.some(id => String(id) === String(hostId));
}

/** Live sessions the user should be notified about (following + not muted). */
export function notifiableLiveSessions(followingIds) {
  const prefs = getLiveNotifPrefs();
  if (!prefs.enabled) return [];
  const follows = new Set((followingIds || []).map(String));
  return liveNow.filter(s =>
    follows.has(String(s.hostId)) && !prefs.muted.some(id => String(id) === String(s.hostId))
  );
}
