import { Navigate, Outlet } from 'react-router-dom';
import type { GuestRouteProps } from './type';
import { useAuthStore } from '../../store/useAuthStore';

export default function GuestRoute({ redirectPath = '/' }: GuestRouteProps) {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}
