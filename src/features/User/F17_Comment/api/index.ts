import axios from '../../../../lib/axios';
import type {
  CreateCommentPayload,
  UpdateCommentPayload,
  CommentListResponse,
  CommentMutationResponse,
  DeleteCommentResponse,
} from '../types';

export const getComments = async (postId: string, page = 1): Promise<CommentListResponse> => {
  const response = await axios.get(`/api/posts/${postId}/comments`, { params: { page } });
  return response.data;
};

export const createComment = async (postId: string, data: CreateCommentPayload): Promise<CommentMutationResponse> => {
  const response = await axios.post(`/api/posts/${postId}/comments`, data);
  return response.data;
};

export const updateComment = async (postId: string, commentId: string, data: UpdateCommentPayload): Promise<CommentMutationResponse> => {
  const response = await axios.put(`/api/posts/${postId}/comments/${commentId}`, data);
  return response.data;
};

export const deleteComment = async (postId: string, commentId: string): Promise<DeleteCommentResponse> => {
  const response = await axios.delete(`/api/moderator/posts/${postId}/comments/${commentId}`);
  return response.data;
};
