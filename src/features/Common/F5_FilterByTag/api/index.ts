import axios from '../../../../lib/axios';
import type { TagDetailData } from '../types';
import type { BaseApiResponse } from '../../../../types';

export const getPostsByTag = async (slug: string, page = 1): Promise<BaseApiResponse<TagDetailData>> => {
  const response = await axios.get(`/api/explore/tag/${slug}`, {
    params: { page }
  });
  return response.data;
};

export const getAllTags = async () => {
  const response = await axios.get('/api/explore/tags'); 
  return response.data;
};
