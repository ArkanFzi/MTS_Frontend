export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: import('@/types').User;
  };
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string, rememberMe: boolean) => void;
  isLoading: boolean;
  errorMsg: string;
}
