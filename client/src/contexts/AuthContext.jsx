import { createContext, useContext, useEffect, useMemo, useState, startTransition } from 'react';
import { useNavigate } from 'react-router-dom';
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

/**
 * 보호된 라우트(ProtectedRoute) 안에서 로그아웃할 때 쓰는 헬퍼.
 * navigate와 logout을 따로 호출하면, role이 지워지는 순간 현재 라우트의
 * ProtectedRoute가 먼저 반응해 /auth로 리다이렉트해버리는 레이스가 생긴다
 * (navigate의 라우트 전환은 내부적으로 트랜지션이라 늦게 커밋됨).
 * 두 업데이트를 같은 트랜지션으로 묶어 한 번에 커밋되게 해서 피한다.
 */
export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return () => {
    startTransition(() => {
      navigate('/');
      logout();
    });
  };
}
