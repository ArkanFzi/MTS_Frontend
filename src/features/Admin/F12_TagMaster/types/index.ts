// src/features/Admin/F12_TagMaster/types/index.ts
import type { Tag } from '../../../../types';

export interface CreateTagPayload {
  name: string;
  color?: string;
}

export interface UpdateTagPayload {
  name?: string;
  color?: string;
}

export interface TagListResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Tag[];
    last_page: number;
    per_page: number;
    total: number;
  };
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
