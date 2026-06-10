// src/features/Common/F6_FilterByCategory/api/index.ts

import axios from '../../../../lib/axios';
import type { CategoriesWithTagsResponse } from '../types';

export async function getCategoriesWithTags(): Promise<CategoriesWithTagsResponse> {
  const response = await axios.get('/api/explore/categories/with-tags');
  return response.data;
}
