import axios from '../../../../lib/axios';
import type { CommentEditHistoryResponse } from '../types';

export const getCommentHistory = async (commentId: string): Promise<CommentEditHistoryResponse> => {
  const response = await axios.get(`/api/moderator/comments/${commentId}/history`);
  return response.data;
};
