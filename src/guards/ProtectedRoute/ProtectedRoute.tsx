import { Navigate, Outlet } from 'react-router-dom';
import type { ProtectedRouteProps } from './type';
import { useAuthStore } from '../../store/useAuthStore';

/**
 * Route Guard Pattern — Strict role-based access control.
 *
 * Security rules (fail-closed):
 *  1. No user → redirect to login
 *  2. User is banned → redirect to /banned
 *  3. If allowedRoles is specified:
 *     a. user.roles is missing/empty → DENY (redirect to /403)
 *     b. No matching role → DENY (redirect to /403)
 *  4. Otherwise → render child route
 */
export default function ProtectedRoute({
  allowedRoles,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { user } = useAuthStore();

  // 1. Not authenticated → redirect to login
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // 2. Banned user → redirect to banned info page
  if (user.is_banned) {
    return <Navigate to="/banned" replace />;
  }

  // 3. Role-based access control (fail-closed)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user.roles;

    // 3a. If user has no roles data at all → DENY (fail-closed, not fail-open)
    if (!userRoles || userRoles.length === 0) {
      return <Navigate to="/403" replace />;
    }

    // 3b. Check if any user role matches the allowed roles
    const hasPermission = userRoles.some((role: string) =>
      allowedRoles.includes(role)
    );

    if (!hasPermission) {
      return <Navigate to="/403" replace />;
    }
  }

  // 4. All checks passed → render the protected content
  return <Outlet />;
}
