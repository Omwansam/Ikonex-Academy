import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ikonex_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const { password: _, ...safeUser } = parsed;
        setUser(safeUser);
      } catch {
        localStorage.removeItem('ikonex_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, token) => {
    const { password: _, ...safeUser } = userData;
    localStorage.setItem('ikonex_user', JSON.stringify(safeUser));
    localStorage.setItem('ikonex_token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ikonex_user');
    localStorage.removeItem('ikonex_token');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
