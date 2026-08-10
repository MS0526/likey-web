import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (role) => setRole(role);
  const logout = () => {
    localStorage.removeItem('likeyToken');
    setRole(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('likeyToken');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        login(res.data.data.role);
      })
      .catch(() => {
        localStorage.removeItem('likeyToken');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const homePath = role === 'org' ? '/org' : role === 'user' || role === 'guest' ? '/market' : '/auth';

  const value = useMemo(
    () => ({ user: { role }, loading, homePath, login, logout }),
    [role, loading, homePath],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
