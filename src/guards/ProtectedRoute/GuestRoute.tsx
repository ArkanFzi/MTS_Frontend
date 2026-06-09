// src/guards/GuestRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import type { GuestRouteProps } from './type';

export default function GuestRoute({ redirectPath = '/' }: GuestRouteProps) {
  const token = localStorage.getItem('auth_token');

  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}