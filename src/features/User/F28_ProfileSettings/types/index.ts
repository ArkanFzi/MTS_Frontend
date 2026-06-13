// src/features/User/F28_ProfileSettings/types/index.ts
import type { User } from '../../../../types';

export interface Profile extends User {}

export interface UpdateProfilePayload {
  username?: string;
  email?: string;
  bio?: string;
  avatar?: File; // File upload — backend validates as image|mimes:jpg,jpeg,png,webp|max:2048
}

export interface UpdatePasswordPayload {
  old_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ProfileResponse {
  success: boolean;
  message?: string; 
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