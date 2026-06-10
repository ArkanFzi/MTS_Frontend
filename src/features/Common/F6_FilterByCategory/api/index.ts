import axios from '../../../../lib/axios';
import type { CategoryPostsResponse } from '../types';

export const getPostsByCategory = async (slug: string, page = 1): Promise<CategoryPostsResponse> => {
  const response = await axios.get(`/api/explore/category/${slug}`, {
    params: { page },
  });
  return response.data;
};
