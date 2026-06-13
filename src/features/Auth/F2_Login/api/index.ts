import axios from "../../../../lib/axios";
import type { LoginPayload, LoginResponse } from "../types";

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  await axios.get('/sanctum/csrf-cookie');
  const response = await axios.post('/api/auth/login', data);
  return response.data;
};