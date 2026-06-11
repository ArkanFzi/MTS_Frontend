// src/features/User/F28_ProfileSettings/types/index.ts
import type { User } from '../../../../types';

export interface Profile extends User {}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data: Profile;
}

export interface PasswordUpdateResponse {
  success: boolean;
  message: string;
}
