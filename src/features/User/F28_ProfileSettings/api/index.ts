// src/features/User/F28_ProfileSettings/api/index.ts
import axios from '../../../../lib/axios';
import type { PasswordUpdateResponse, ProfileResponse, ProfileUpdateResponse, UpdatePasswordPayload } from '../types';

/**
 * Mengambil data profil user yang sedang login
 * URL Asli: http://localhost:8000/api/settings/profile
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axios.get('/api/settings/profile'); 
  return response.data;
};

/**
 * Memperbarui informasi profil beserta avatar (menggunakan FormData)
 * URL Asli: http://localhost:8000/api/settings/profile
 */
export const updateProfile = async (formData: FormData): Promise<ProfileUpdateResponse> => {
  const response = await axios.post('/api/settings/profile', formData, {
    headers: {
      // Memaksa browser untuk menyusun ulang content-type dan boundary file
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Memperbarui password user
 * URL Asli: http://localhost:8000/api/settings/password
 */
export const updatePassword = async (payload: UpdatePasswordPayload): Promise<PasswordUpdateResponse> => {
  const response = await axios.put('/api/settings/password', payload);
  return response.data;
};