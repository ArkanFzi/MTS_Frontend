// src/features/User/F24_BookmarkPost/api/index.ts
import axios from '../../../../lib/axios';
import type { BookmarkItem, ToggleBookmarkResponse } from '../types';

/**
 * Fetch all bookmarks for the authenticated user.
 * Backend returns: { message, data: BookmarkItem[] }
 */
export const fetchBookmarks = async (): Promise<{ message: string; data: BookmarkItem[] }> => {
  const response = await axios.get('/api/bookmarks');
  return response.data;
};

/**
 * Toggle bookmark for a given post.
 * Backend route: POST /api/bookmarks/toggle  body: { post_id }
 */
export const toggleBookmark = async (postId: string): Promise<ToggleBookmarkResponse> => {
  const response = await axios.post('/api/bookmarks/toggle', { post_id: postId });
  return response.data;
};
