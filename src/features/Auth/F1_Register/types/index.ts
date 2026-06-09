// src/features/Auth/F1_Register/types/index.ts
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  message: string;
  user: import('@/types').User;
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterPayload) => void;
  isLoading: boolean;
  errorMsg: string;
}