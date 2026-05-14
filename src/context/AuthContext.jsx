import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { users } from '../data/users';

const AuthContext = createContext(null);

const STORAGE_KEY = 'asl-auth-v2';

function readStored() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function writeStored(value) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); } catch { /* ignore */ }
}

export function AuthProvider({ children }) {
  // Rehydrate from localStorage so refreshes don't kick the user back to guest.
  const stored = readStored();

  const [isAuthenticated, setIsAuthenticated] = useState(stored?.isAuthenticated ?? false);
  const [currentUserId, setCurrentUserId] = useState(stored?.userId ?? 'me');
  const [profile, setProfile] = useState(stored?.profile ?? null); // { email, phone, roles, name }

  // Auth prompt state — generic sign-up nag
  const [authPrompt, setAuthPrompt] = useState({ open: false, reason: '', intent: '', redirectTo: null });

  // DM-specific conversion modal (different copy + screenshot than the generic prompt)
  const [dmPrompt, setDmPrompt] = useState({ open: false, placement: 'generic' });

  // Persist on change
  useEffect(() => {
    writeStored({
      isAuthenticated,
      userId: currentUserId,
      profile,
    });
  }, [isAuthenticated, currentUserId, profile]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  /** Roles array — e.g. ['Wholesaler'] or ['Fix N Flipper', 'Landlord'] */
  const roles = profile?.roles || [];

  /** Primary role = first selected role. Used to decide default landing page. */
  const primaryRole = roles[0] || null;
  const isWholesalerOnly = roles.length === 1 && roles[0] === 'Wholesaler';

  /** Where to send a user after login/signup based on their role. */
  const defaultLandingPath = () => {
    if (isWholesalerOnly) return '/my-deals';
    return '/marketplace';
  };

  const login = (userId = 'me', extra = {}) => {
    setCurrentUserId(userId);
    setIsAuthenticated(true);
    if (extra.profile) setProfile(extra.profile);
    setAuthPrompt({ open: false, reason: '', intent: '', redirectTo: null });
    setDmPrompt({ open: false, placement: 'generic' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
  };

  /** Update the profile (e.g. after role-selection modal). */
  const updateProfile = useCallback((patch) => {
    setProfile(prev => ({ ...(prev || {}), ...patch }));
  }, []);

  // requireAuth(reason, intent, redirectTo) — generic version (shows the existing AuthPromptModal)
  const requireAuth = useCallback((reason = 'view this', intent = 'open', redirectTo = null) => {
    if (isAuthenticated) return true;
    setAuthPrompt({ open: true, reason, intent, redirectTo });
    return false;
  }, [isAuthenticated]);

  /** Show the DM-specific conversion modal. `placement` tags where it was triggered. */
  const requireAuthForDM = useCallback((placement = 'generic') => {
    if (isAuthenticated) return true;
    setDmPrompt({ open: true, placement });
    return false;
  }, [isAuthenticated]);

  const closeAuthPrompt = useCallback(() => {
    setAuthPrompt(p => ({ ...p, open: false }));
  }, []);

  const closeDmPrompt = useCallback(() => {
    setDmPrompt(p => ({ ...p, open: false }));
  }, []);

  // Back-compat: many pages check `isLoggedIn` — keep it as an alias.
  const isLoggedIn = isAuthenticated;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        profile,
        roles,
        primaryRole,
        isWholesalerOnly,
        defaultLandingPath,
        isLoggedIn,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        setCurrentUserId,
        requireAuth,
        requireAuthForDM,
        authPrompt,
        dmPrompt,
        closeAuthPrompt,
        closeDmPrompt,
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
