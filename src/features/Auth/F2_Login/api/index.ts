import axios from "../../../../lib/axios";


export const loginUser = async (data: any) => {
    // Sanctum CSRF Protection
    await axios.get('/sanctum/csrf-cookie'); 
    // Backend API Anda menerima: email, password
    const response = await axios.post('/api/auth/login', data);
    return response.data;
};
