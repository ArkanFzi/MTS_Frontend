import axios from '../../../../lib/axios';
import type { UserBadgeListResponse } from '../types';

export const getMyBadges = async (): Promise<UserBadgeListResponse> => {
  const response = await axios.get('/api/me/badges');
  return response.data;
};
