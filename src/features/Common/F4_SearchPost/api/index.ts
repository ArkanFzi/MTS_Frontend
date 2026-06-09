import axios from '../../../../lib/axios'; // Gunakan global interceptor axios
import type { SearchQuery, SearchResponse } from '../types';

export const fetchSearchPosts = async (params: SearchQuery): Promise<SearchResponse> => {
  const response = await axios.get<SearchResponse>('/api/explore/search', {
    params: {
      q: params.q,
      page: params.page || 1,
      sort: params.sort || 'terbaru', // ← Mengirimkan parameter filter ke backend
    }
  });
  return response.data;
};
