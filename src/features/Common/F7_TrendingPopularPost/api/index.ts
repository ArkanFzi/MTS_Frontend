import axios from '../../../../lib/axios';
import type { TrendingResponse } from '../types';

export const getTrendingPosts = async (type: 'trending' | 'popular' = 'trending', limit = 10): Promise<TrendingResponse> => {
  const response = await axios.get('/api/explore/trending', {
    params: { type, limit },
  });
  return response.data;
};
