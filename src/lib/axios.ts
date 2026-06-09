import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://localhost:8000', // Sesuaikan dengan URL Backend Laravel
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Wajib untuk Sanctum SPA
});

// Hapus bagian axios.interceptors.request.use(...) sepenuhnya
// karena otorisasi sekarang diurus otomatis oleh Cookie browser.

export default axios;