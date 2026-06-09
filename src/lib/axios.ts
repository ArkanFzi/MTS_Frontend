import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://localhost:8000', // Sesuaikan dengan URL Backend Laravel Anda
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Penting jika backend Anda memakai Sanctum (cookie-based)
});

// Interceptor: Otomatis menyematkan token Bearer di setiap request jika token tersedia di localStorage
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;
