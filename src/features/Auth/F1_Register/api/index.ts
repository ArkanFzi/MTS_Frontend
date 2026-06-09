import axios from "../../../../lib/axios";
import type { RegisterPayload, RegisterResponse } from "../types"; // ← Import types

export const registerUser = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response = await axios.post('/api/auth/register', data);
  return response.data;
};
