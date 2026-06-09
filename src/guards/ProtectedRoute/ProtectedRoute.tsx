import { Navigate, Outlet } from 'react-router-dom';
import type { ProtectedRouteProps } from './type';
import { useAuthStore } from '../../store/useAuthStore'; // ← Import Zustand

export default function ProtectedRoute({ allowedRoles, fallbackPath = '/login' }: ProtectedRouteProps) {
  // ← Baca dari Zustand, bukan localStorage langsung
  const { token, user } = useAuthStore();

  // 1. Jika belum login, tendang ke login
  if (!token || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // 2. Jika ada pembatasan Role, cek apakah role user cocok
  if (allowedRoles && !allowedRoles.includes(user.role ?? '')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
