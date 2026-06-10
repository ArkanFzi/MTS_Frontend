export interface ProtectedRouteProps {
  /** Roles allowed to access this route. Omit = any authenticated user. */
  allowedRoles?: string[];
  /** Where to redirect if not authenticated. Default: /login */
  fallbackPath?: string;
}

export interface GuestRouteProps {
  /** Where to redirect if already authenticated. Default: / */
  redirectPath?: string;
}
