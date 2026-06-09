import axios from '../../../../lib/axios';
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryListResponse,
  CategoryDetailResponse,
  CategoryMutationResponse,
  DeleteCategoryResponse,
} from '../types';

export const getCategories = async (): Promise<CategoryListResponse> => {
  const response = await axios.get('/api/moderator/categories');
  return response.data;
};

export const getCategory = async (id: string): Promise<CategoryDetailResponse> => {
  const response = await axios.get(`/api/moderator/categories/${id}`);
  return response.data;
};

export const createCategory = async (data: CreateCategoryPayload): Promise<CategoryMutationResponse> => {
  const response = await axios.post('/api/moderator/categories', data);
  return response.data;
};

export const updateCategory = async (id: string, data: UpdateCategoryPayload): Promise<CategoryMutationResponse> => {
  const response = await axios.put(`/api/moderator/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string): Promise<DeleteCategoryResponse> => {
  const response = await axios.delete(`/api/moderator/categories/${id}`);
  return response.data;
};
