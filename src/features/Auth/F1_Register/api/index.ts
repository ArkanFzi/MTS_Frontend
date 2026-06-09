import axios from "../../../../lib/axios";



export const registerUser = async (data: any) => {
    // Backend API Anda menerima: username, email, password, password_confirmation
    const response = await axios.post('/api/auth/register', data);
    return response.data;
};
