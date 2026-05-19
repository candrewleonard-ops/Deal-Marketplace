import { useState, useEffect, useCallback } from 'react';

const KEY = 'asl_saved_deals';
const LEGACY_KEY = 'treim_saved_deals';
const SAVED_EVENT = 'asl-saved-change';

// One-time migration: move any pre-rebrand saved list to the new key.
(function migrateLegacy() {
  try {
    if (localStorage.getItem(KEY) == null && localStorage.getItem(LEGACY_KEY) != null) {
      localStorage.setItem(KEY, localStorage.getItem(LEGACY_KEY));
      localStorage.removeItem(LEGACY_KEY);
    }
  } catch { /* ignore */ }
})();

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(ids) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
  window.dispatchEvent(new Event(SAVED_EVENT));
}

export function useSavedDeals() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(SAVED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SAVED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isSaved = useCallback((id) => ids.includes(String(id)), [ids]);
  const toggle = useCallback((id) => {
    const sid = String(id);
    const next = ids.includes(sid) ? ids.filter(x => x !== sid) : [...ids, sid];
    setIds(next);
    write(next);
    return !ids.includes(sid); // returns new saved state
  }, [ids]);

  const clear = useCallback(() => { setIds([]); write([]); }, []);

  const removeMany = useCallback((idsToRemove) => {
    const set = new Set(idsToRemove.map(String));
    const next = ids.filter(x => !set.has(x));
    setIds(next);
    write(next);
  }, [ids]);

  return { savedIds: ids, isSaved, toggle, clear, removeMany };
}
