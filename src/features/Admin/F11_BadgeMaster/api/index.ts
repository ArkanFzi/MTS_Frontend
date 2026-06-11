import axios from '../../../../lib/axios';
import type {
  CreateBadgePayload,
  UpdateBadgePayload,
  BadgeListResponse,
  BadgeMutationResponse,
  DeleteBadgeResponse,
} from '../types';

export const getBadges = async (): Promise<BadgeListResponse> => {
  const response = await axios.get('/api/moderator/badges');
  return response.data;
};

export const createBadge = async (data: CreateBadgePayload): Promise<BadgeMutationResponse> => {
  const response = await axios.post('/api/moderator/badges', data);
  return response.data;
};

export const updateBadge = async (id: string, data: UpdateBadgePayload): Promise<BadgeMutationResponse> => {
  const response = await axios.put(`/api/moderator/badges/${id}`, data);
  return response.data;
};

export const deleteBadge = async (id: string): Promise<DeleteBadgeResponse> => {
  const response = await axios.delete(`/api/moderator/badges/${id}`);
  return response.data;
};
