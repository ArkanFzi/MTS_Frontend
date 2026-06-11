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

export const updateProfile = async (data: UpdateProfilePayload): Promise<ProfileUpdateResponse> => {
  const response = await axios.put('/api/settings/profile', data);
  return response.data;
};

export const updatePassword = async (data: UpdatePasswordPayload): Promise<PasswordUpdateResponse> => {
  const response = await axios.put('/api/settings/password', data);
  return response.data;
};
