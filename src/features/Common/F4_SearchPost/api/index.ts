import axios from 'axios';
import type { SearchQuery, SearchResponse } from '../types';


// Setup instance axios dasar
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Sesuaikan port Laravel-mu
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchSearchPosts = async (params: SearchQuery): Promise<SearchResponse> => {
  const response = await apiClient.get<SearchResponse>('/api/explore/search', {
    params: {
      q: params.q,
      page: params.page || 1,
      // Tambahkan param lain jika backend mendukung sorting
    }
  });
  return response.data;
};