// src/features/User/F25_FollowUser/api/index.ts
import axios from '../../../../lib/axios';
import type { ToggleFollowResponse, FollowListResponse, UserProfileResponse } from '../types';

export const toggleFollow = async (userId: string): Promise<ToggleFollowResponse> => {
  const response = await axios.post(`/api/users/${userId}/follow`);
  return response.data;
};

export const getFollowers = async (userId: string): Promise<FollowListResponse> => {
  const response = await axios.get(`/api/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId: string): Promise<FollowListResponse> => {
  const response = await axios.get(`/api/users/${userId}/following`);
  return response.data;
};

export const getUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  const response = await axios.get(`/api/users/${userId}/profile`);
  return response.data;
};
