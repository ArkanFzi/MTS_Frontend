import axios from '../../../../lib/axios';
import type { MarkAcceptedAnswerResponse } from '../types';

export const markAcceptedAnswer = async (postId: string, commentId: string): Promise<MarkAcceptedAnswerResponse> => {
  const response = await axios.post(`/api/posts/${postId}/comments/${commentId}/accept`);
  return response.data;
};
