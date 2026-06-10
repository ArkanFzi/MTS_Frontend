import axios from '../../../../lib/axios';
import type { SearchQuery, SearchResponse } from '../types';

export const fetchSearchPosts = async (params: SearchQuery): Promise<SearchResponse> => {
  const response = await axios.get<SearchResponse>('/api/explore/search', {
    params: {
      q: params.q,
      page: params.page || 1,
      sort: params.sort || 'terbaru',
      category: params.category || undefined,
    },
  });
  return response.data;
};

export const fetchCategories = async (): Promise<{ success: boolean; data: Array<{ id: string; name: string; slug: string }> }> => {
  const response = await axios.get('/api/explore/categories');
  return response.data;
};
