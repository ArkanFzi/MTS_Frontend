import axios from '../../../../lib/axios';
import type { CategoryDetailData } from '../types';
import type { BaseApiResponse } from '../../../../types';

export const getPostsByCategory = async (slug: string, page = 1): Promise<BaseApiResponse<CategoryDetailData>> => {
  const response = await axios.get(`/api/explore/category/${slug}`, {
    params: { page },
  });
  return response.data;
};
