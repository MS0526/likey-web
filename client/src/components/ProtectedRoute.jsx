import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allow = [], children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-sm text-subtle">불러오는 중...</div>;

  if (!allow.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
