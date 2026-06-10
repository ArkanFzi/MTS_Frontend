// src/features/Admin/F10_CategoryMaster/types/index.ts
import type { Category } from '../../../../types';

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export interface CategoryListResponse {
  status: string;
  message: string;
  data: Category[];
}

export interface CategoryDetailResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface CategoryMutationResponse {
  success: boolean;
  message: string;
  data: Category;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}
