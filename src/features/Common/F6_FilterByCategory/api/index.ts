// src/features/Common/F6_FilterByCategory/api/index.ts

import axios from '../../../../lib/axios';
import type { CategoriesWithTagsResponse, CategoryPostsResponse } from '../types';

export async function getCategoriesWithTags(): Promise<CategoriesWithTagsResponse> {
  const response = await axios.get('/api/explore/categories/with-tags');
  return response.data;
}

export const getPostsByCategory = async (
  slug: string,
  page = 1,
  sort = 'newest',
  tag?: string
): Promise<CategoryPostsResponse> => {
  const response = await axios.get(`/api/explore/category/${slug}`, {
    params: { page, sort, tag }
  });
  return response.data;
};
