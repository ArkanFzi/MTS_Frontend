import axios from '../../../../lib/axios';
import type { CreateReplyPayload, UpdateReplyPayload, ReplyMutationResponse } from '../types';

export const createReply = async (postId: string, commentId: string, data: CreateReplyPayload): Promise<ReplyMutationResponse> => {
  const response = await axios.post(`/api/posts/${postId}/comments/${commentId}/replies`, data);
  return response.data;
};

export const updateReply = async (postId: string, commentId: string, replyId: string, data: UpdateReplyPayload): Promise<ReplyMutationResponse> => {
  const response = await axios.put(`/api/posts/${postId}/comments/${commentId}/replies/${replyId}`, data);
  return response.data;
};
