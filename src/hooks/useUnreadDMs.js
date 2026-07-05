import { useState, useEffect } from 'react';
import { fetchConversations, unreadFromConversations } from '../lib/dms';
import { subscribeInbox } from '../lib/inbox';
import { useAuth } from '../context/AuthContext';

/** Live count of DM threads with unread messages (polls + reacts to reads). */
export function useUnreadDMs() {
  const { currentUser, isAuthenticated } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) { setCount(0); return; }
    let alive = true;
    const refresh = async () => {
      try {
        const convs = await fetchConversations(currentUser.id);
        if (alive) setCount(Object.keys(unreadFromConversations(convs)).length);
      } catch { /* offline — keep last value */ }
    };
    refresh();
    const iv = setInterval(refresh, 15000);
    const unsub = subscribeInbox(refresh);
    return () => { alive = false; clearInterval(iv); unsub(); };
  }, [isAuthenticated, currentUser?.id]);

  return count;
}
