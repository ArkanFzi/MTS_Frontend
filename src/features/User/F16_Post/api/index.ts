import axios from '../../../../lib/axios';
import type {
  CreatePostPayload,
  UpdatePostPayload,
  PostListResponse,
  PostDetailResponse,
  PostMutationResponse,
  DeletePostResponse,
} from '../types';

export const getPosts = async (page = 1): Promise<PostListResponse> => {
  const response = await axios.get('/api/posts', { params: { page } });
  return response.data;
};

export const getPostDetail = async (id: string): Promise<PostDetailResponse> => {
  const response = await axios.get(`/api/posts/${id}`);
  return response.data;
};

export const getMyPosts = async (page = 1): Promise<PostListResponse> => {
  const response = await axios.get('/api/me/posts', { params: { page } });
  return response.data;
};

export const createPost = async (data: CreatePostPayload): Promise<PostMutationResponse> => {
  const response = await axios.post('/api/posts', data);
  return response.data;
};

export const updatePost = async (id: string, data: UpdatePostPayload): Promise<PostMutationResponse> => {
  const response = await axios.put(`/api/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id: string): Promise<DeletePostResponse> => {
  const response = await axios.delete(`/api/posts/${id}`);
  return response.data;
};
