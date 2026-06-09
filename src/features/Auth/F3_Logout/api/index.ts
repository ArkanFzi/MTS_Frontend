import axios from "../../../../lib/axios";
import type { LogoutResponse } from '../types';

export const logoutUser = async (): Promise<LogoutResponse> => {
  const response = await axios.post('/api/auth/logout');
  return response.data;
};
