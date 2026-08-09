import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allow = [], children }) {
  const { user } = useAuth();

  if (!allow.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
