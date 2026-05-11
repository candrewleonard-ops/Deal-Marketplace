import { createContext, useContext, useState, useCallback } from 'react';
import { users } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Visitors land as guests by default — they can browse, but actions like opening
  // a property, saving, messaging, etc. trigger the sign-up prompt.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('me');

  // Auth prompt state — shown when a guest tries to perform an action that requires an account
  const [authPrompt, setAuthPrompt] = useState({ open: false, reason: '', intent: '', redirectTo: null });

  // While someone is just browsing as a guest we still show a "preview" identity
  // for components that need an avatar/name. They get the demo user, but `isAuthenticated`
  // is what gates real interactions.
  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const login = (userId = 'me') => {
    setCurrentUserId(userId);
    setIsAuthenticated(true);
    setAuthPrompt({ open: false, reason: '', intent: '', redirectTo: null });
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // requireAuth(reason, intent, redirectTo) — if the user isn't authenticated, opens
  // the global sign-up/sign-in modal and returns false. Otherwise returns true.
  const requireAuth = useCallback((reason = 'view this', intent = 'open', redirectTo = null) => {
    if (isAuthenticated) return true;
    setAuthPrompt({ open: true, reason, intent, redirectTo });
    return false;
  }, [isAuthenticated]);

  const closeAuthPrompt = useCallback(() => {
    setAuthPrompt(p => ({ ...p, open: false }));
  }, []);

  // Back-compat: many pages check `isLoggedIn` — keep it as an alias.
  const isLoggedIn = isAuthenticated;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isAuthenticated,
        login,
        logout,
        setCurrentUserId,
        requireAuth,
        authPrompt,
        closeAuthPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
