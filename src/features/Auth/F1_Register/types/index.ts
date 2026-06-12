// src/features/Auth/F1_Register/types/index.ts
import type { User } from '../../../../types';

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    user: User;
  };
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterPayload) => void;
  isLoading: boolean;
  errorMsg: string;
}