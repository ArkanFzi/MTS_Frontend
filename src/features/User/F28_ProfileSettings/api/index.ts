// src/features/User/F28_ProfileSettings/api/index.ts
import axios from '../../../../lib/axios';
import type {
  UpdateProfilePayload,
  UpdatePasswordPayload,
  ProfileResponse,
  ProfileUpdateResponse,
  PasswordUpdateResponse,
} from '../types';

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axios.get('/api/settings/profile');
  return response.data;
};

/**
 * Update profile — sends FormData to support avatar file upload.
 * Uses POST with _method=PUT because FormData + PUT has browser quirks.
 */
export const updateProfile = async (data: UpdateProfilePayload): Promise<ProfileUpdateResponse> => {
  const formData = new FormData();
  formData.append('_method', 'PUT');

  if (data.username !== undefined) formData.append('username', data.username);
  if (data.email !== undefined) formData.append('email', data.email);
  if (data.bio !== undefined) formData.append('bio', data.bio);
  if (data.avatar) formData.append('avatar', data.avatar);

  const response = await axios.post('/api/settings/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updatePassword = async (data: UpdatePasswordPayload): Promise<PasswordUpdateResponse> => {
  const response = await axios.put('/api/settings/password', data);
  return response.data;
};
