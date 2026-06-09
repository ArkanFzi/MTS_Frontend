export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// RESPONSE dari API jika berhasil
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// State form validation error
export interface RegisterFormErrors {
  username?: string[];
  email?: string[];
  password?: string[];
}