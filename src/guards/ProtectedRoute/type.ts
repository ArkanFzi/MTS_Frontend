export interface ProtectedRouteProps {
  allowedRoles?: string[];
  fallbackPath?: string;
}


export interface GuestRouteProps {
  redirectPath?: string; 
}