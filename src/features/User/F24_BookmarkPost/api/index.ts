import axios from '../../../../lib/axios';
import type { BookmarkPayload, ToggleBookmarkResponse, BookmarkListResponse } from '../types';

export const toggleBookmark = async (data: BookmarkPayload): Promise<ToggleBookmarkResponse> => {
  const response = await axios.post('/api/bookmarks/toggle', data);
  return response.data;
};

export const getBookmarks = async (page = 1): Promise<BookmarkListResponse> => {
  const response = await axios.get('/api/bookmarks', { params: { page } });
  return response.data;
};
