// src/features/Auth/F31_ForgotPassword/api/index.ts
import axios from '../../../../lib/axios';
import type {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from '../types';

export const sendResetLink = async (data: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
  const response = await axios.post('/api/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
  const response = await axios.post('/api/auth/reset-password', data);
  return response.data;
};
