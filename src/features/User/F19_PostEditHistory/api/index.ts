import axios from '../../../../lib/axios';
import type { PostEditHistoryResponse } from '../types';

export const getPostHistory = async (postId: string): Promise<PostEditHistoryResponse> => {
  const response = await axios.get(`/api/moderator/posts/${postId}/history`);
  return response.data;
};
