import axios from '../../../../lib/axios';
import type { LikePayload, LikeResponse } from '../types';

export const toggleLike = async (data: LikePayload): Promise<LikeResponse> => {
  const response = await axios.post('/api/likes/toggle', data);
  return response.data;
};
