export interface LoginPayload {
  email: string;
  password: string;
}

// RESPONSE saat login berhasil (simpan ke localStorage/context)
export interface LoginResponse {
  token: string;
  user: import('@/types').User;
}

// State form error
export interface LoginFormErrors {
  email?: string[];
  password?: string[];
  general?: string; // "The provided credentials are incorrect"
}