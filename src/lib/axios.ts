import Axios from 'axios';
import type { AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// ─── Pattern #6: Environment Configuration ───
// baseURL is driven entirely from .env — no hardcoded URLs.
const axios = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Required for Laravel Sanctum SPA cookie auth
});

// ─── Pattern #7: Global Response Interceptor ───
// Catches 401 Unauthorized globally → auto-logout + redirect to login.
// This means individual API calls never need to handle session expiry manually.
axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Clear auth state and redirect
            const { logout } = useAuthStore.getState();
            logout();

            // Only redirect if not already on an auth page
            const currentPath = window.location.pathname;
            const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
            if (!authPages.some((p) => currentPath.startsWith(p))) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

export default axios;
