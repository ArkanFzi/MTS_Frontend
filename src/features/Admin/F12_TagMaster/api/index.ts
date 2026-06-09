import axios from '../../../../lib/axios';
import type {
  CreateTagPayload,
  UpdateTagPayload,
  TagListResponse,
  TagMutationResponse,
  DeleteTagResponse,
} from '../types';

export const getModeratorTags = async (): Promise<TagListResponse> => {
  const response = await axios.get('/api/moderator/tags');
  return response.data;
};

export const createTag = async (data: CreateTagPayload): Promise<TagMutationResponse> => {
  const response = await axios.post('/api/tags', data);
  return response.data;
};

export const updateModeratorTag = async (id: string, data: UpdateTagPayload): Promise<TagMutationResponse> => {
  const response = await axios.put(`/api/moderator/tags/${id}`, data);
  return response.data;
};

export const deleteModeratorTag = async (id: string): Promise<DeleteTagResponse> => {
  const response = await axios.delete(`/api/moderator/tags/${id}`);
  return response.data;
};
