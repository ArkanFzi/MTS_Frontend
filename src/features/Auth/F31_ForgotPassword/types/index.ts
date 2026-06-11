// src/features/Auth/F31_ForgotPassword/types/index.ts

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordPayload) => void;
  isLoading: boolean;
  errorMsg: string;
  successMsg: string;
}

export interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordPayload) => void;
  isLoading: boolean;
  errorMsg: string;
  successMsg: string;
  email: string;
  token: string;
}
