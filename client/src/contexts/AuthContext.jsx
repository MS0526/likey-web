import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);

  const login = (role) => setRole(role);
  const logout = () => setRole(null);

  const value = useMemo(() => ({ user: { role }, login, logout }), [role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 쓸 수 있습니다');
  return ctx;
}
