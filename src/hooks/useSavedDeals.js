import { useState, useEffect, useCallback } from 'react';

const KEY = 'treim_saved_deals';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(ids) {
  try { localStorage.setItem(KEY, JSON.stringify(ids)); } catch {}
  window.dispatchEvent(new Event('treim-saved-change'));
}

export function useSavedDeals() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener('treim-saved-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('treim-saved-change', sync);
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

  return { savedIds: ids, isSaved, toggle, clear };
}
