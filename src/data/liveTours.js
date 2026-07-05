/**
 * Live Real Estate Tours — sessions + follower-notification preferences.
 *
 * Notifications default ON for everyone following a wholesaler; viewers can
 * turn them off globally or mute specific hosts (Settings on the Live page).
 */

export const liveNow = [
  {
    id: 'live-1',
    hostId: 1,
    hostName: 'Marcus Johnson',
    hostAvatar: 'https://picsum.photos/seed/user1/100/100',
    title: 'Walking the Atlanta brick ranch — kitchen & roof up close',
    dealId: 1,
    viewers: 214,
    startedMinutesAgo: 12,
    thumbnail: 'https://picsum.photos/seed/house1/800/600',
  },
  {
    id: 'live-2',
    hostId: 2,
    hostName: 'Diana Cruz',
    hostAvatar: 'https://picsum.photos/seed/user2/100/100',
    title: 'Phoenix fixer LIVE — bring your rehab questions',
    dealId: 2,
    viewers: 156,
    startedMinutesAgo: 4,
    thumbnail: 'https://picsum.photos/seed/house2/800/600',
  },
  {
    id: 'live-3',
    hostId: 5,
    hostName: 'Angela Foster',
    hostAvatar: 'https://picsum.photos/seed/user5/100/100',
    title: 'Memphis drive-for-dollars: 3 streets, 3 leads',
    dealId: null,
    viewers: 89,
    startedMinutesAgo: 31,
    thumbnail: 'https://picsum.photos/seed/memphis/800/600',
  },
];

export const upcomingTours = [
  {
    id: 'up-1',
    hostId: 4,
    hostName: 'Sarah Kim',
    hostAvatar: 'https://picsum.photos/seed/user4/100/100',
    title: 'Houston subject-to walkthrough + Q&A',
    when: 'Today · 6:00 PM CT',
  },
  {
    id: 'up-2',
    hostId: 7,
    hostName: 'James Rivera',
    hostAvatar: 'https://picsum.photos/seed/user7/100/100',
    title: 'KC duplex tour — cash-flow math on camera',
    when: 'Tomorrow · 1:00 PM CT',
  },
];

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
