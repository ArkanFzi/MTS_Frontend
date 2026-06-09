// src/features/Admin/F12_TagMaster/types/index.ts
import type { Tag } from '../../../../types';

export interface CreateTagPayload {
  name: string;
  description?: string;
  hex_color?: string;
}

export interface UpdateTagPayload {
  name?: string;
  description?: string;
  hex_color?: string;
}

export interface TagListResponse {
  status: string;
  message: string;
  data: Tag[];
}

export interface TagMutationResponse {
  success: boolean;
  message: string;
  data: Tag;
}

export interface DeleteTagResponse {
  success: boolean;
  message: string;
}
