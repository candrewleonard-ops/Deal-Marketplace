import { createContext, useContext, useState } from 'react';
import { users } from '../data/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('me');

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  const login = (userId = 'me') => {
    setCurrentUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, login, logout, setCurrentUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
