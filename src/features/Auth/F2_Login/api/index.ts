import axios from "../../../../lib/axios";
import type { LoginPayload, LoginResponse } from "../types";

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post('/api/auth/login', data);
  return response.data;
};
