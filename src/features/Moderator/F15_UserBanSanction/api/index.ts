import axios from '../../../../lib/axios';
import type {
  WarnPayload,
  BanPayload,
  BanListResponse,
  BanActionResponse,
  UnbanResponse,
} from '../types';

export const getBans = async (page = 1, search = ''): Promise<BanListResponse> => {
  const response = await axios.get('/api/moderator/bans', { params: { page, search } });
  return response.data;
};

export const warnUser = async (userId: string, data: WarnPayload): Promise<BanActionResponse> => {
  const response = await axios.post(`/api/moderator/bans/${userId}/warn`, data);
  return response.data;
};

export const banUser = async (userId: string, data: BanPayload): Promise<BanActionResponse> => {
  const response = await axios.post(`/api/moderator/bans/${userId}/ban`, data);
  return response.data;
};

export const unbanUser = async (userId: string): Promise<UnbanResponse> => {
  const response = await axios.post(`/api/moderator/bans/${userId}/unban`);
  return response.data;
};
