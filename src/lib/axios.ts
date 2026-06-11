import Axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const PRIMARY_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const FALLBACK_URL = import.meta.env.VITE_API_FALLBACK_URL || '';

const axios = Axios.create({
    baseURL: PRIMARY_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,          // ← Axios otomatis baca XSRF-TOKEN cookie & kirim sebagai X-XSRF-TOKEN header
    xsrfCookieName: 'XSRF-TOKEN', // nama cookie dari Laravel
    xsrfHeaderName: 'X-XSRF-TOKEN', // nama header yang dibaca Laravel
});

let csrfInitialized = false;
let csrfPromise: Promise<void> | null = null;

const ensureCsrfCookie = async (): Promise<void> => {
    // Jika sudah pernah diinisialisasi di sesi ini, skip
    if (csrfInitialized) return;

    // Cek apakah XSRF-TOKEN ada di cookie
    const hasToken = document.cookie.split('; ').some((c) => c.startsWith('XSRF-TOKEN='));
    if (hasToken) {
        csrfInitialized = true;
        return;
    }

    // Fetch CSRF cookie dari Sanctum (hanya sekali jika ada concurrent requests)
    if (!csrfPromise) {
        csrfPromise = axios.get('/sanctum/csrf-cookie').then(() => {
            csrfInitialized = true;
            csrfPromise = null;
        }).catch(() => {
            csrfPromise = null;
        });
    }
    await csrfPromise;
};

axios.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() ?? '')) {
        await ensureCsrfCookie();
    }
    return config;
});


const isNetworkError = (error: AxiosError): boolean => {
    return !error.response && (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ERR_NETWORK' ||
        error.code === 'ECONNABORTED' ||
        error.message?.includes('Network Error') ||
        error.message?.includes('timeout')
    );
};

axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

        if (FALLBACK_URL && isNetworkError(error) && !config._retried) {
            config._retried = true;
            config.baseURL = FALLBACK_URL;
            return axios.request(config);
        }

        if (error.response?.status === 401) {
            const { logout } = useAuthStore.getState();
            logout();

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