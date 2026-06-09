import { Navigate, Outlet } from 'react-router-dom';
import type { ProtectedRouteProps } from './type';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProtectedRoute({ allowedRoles, fallbackPath = '/login' }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  // 1. If not logged in, redirect to login
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // 2. If role restriction exists, check user roles (backend sends roles as array)
  if (allowedRoles && user.roles) {
    const hasRole = user.roles.some((role: string) => allowedRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
