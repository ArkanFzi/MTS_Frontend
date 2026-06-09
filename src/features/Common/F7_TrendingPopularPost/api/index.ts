import axios from '../../../../lib/axios';
import type { TrendingResponse } from '../types';

export const getTrendingPosts = async (): Promise<TrendingResponse> => {
  const response = await axios.get('/api/explore/trending');
  return response.data;
};
