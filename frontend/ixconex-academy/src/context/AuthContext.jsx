import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('ikonex:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('ikonex:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('ikonex_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getMe();
        setUser(currentUser);
        localStorage.setItem('ikonex_user', JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem('ikonex_user');
        localStorage.removeItem('ikonex_token');
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback((userData, token) => {
    const { password: _, ...safeUser } = userData;
    localStorage.setItem('ikonex_user', JSON.stringify(safeUser));
    localStorage.setItem('ikonex_token', token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local session even if the logout request fails
    }
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
