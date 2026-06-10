import axios from '../../../../lib/axios';
import type { TagPostsResponse } from '../types';

export const getPostsByTag = async (
  slug: string,
  page = 1,
  sort = 'newest',
  category?: string
): Promise<TagPostsResponse> => {
  const response = await axios.get(`/api/explore/tag/${slug}`, {
    params: { page, sort, ...(category ? { category } : {}) },
  });
  return response.data;
};

export const getAllTags = async () => {
  const response = await axios.get('/api/explore/tags');
  return response.data;
};
