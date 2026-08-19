import { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_CREDENTIALS, USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('tis_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email, password) => {
    // Protótipo: sem credenciais → entra como Admin RH
    if (!email && !password) {
      const userData = USERS[0];
      setUser(userData);
      sessionStorage.setItem('tis_user', JSON.stringify(userData));
      return { success: true };
    }
    const cred = DEMO_CREDENTIALS[email];
    if (!cred || cred.password !== password) {
      return { success: false, error: 'Email ou password incorretos.' };
    }
    const userData = USERS.find(u => u.id === cred.userId);
    setUser(userData);
    sessionStorage.setItem('tis_user', JSON.stringify(userData));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('tis_user');
  }, []);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isManager }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
