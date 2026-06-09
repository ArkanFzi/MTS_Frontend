// src/features/User/F16_Post/types/index.ts
import type { Category, Tag, User } from '../../../../types';

export interface Post {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  vote_score: number;
  is_answered: boolean;
  accepted_answer_id: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  category?: Category;
  tags?: Tag[];
  comments_count?: number;
}

export interface PostDetail extends Post {
  comments?: Comment[];
}

export interface CreatePostPayload {
  title: string;
  body: string;
  category_id: string;
  tags: string[];
}

export interface UpdatePostPayload {
  title?: string;
  body?: string;
  category_id?: string;
  tags?: string[];
}

export interface PostListResponse {
  status: string;
  message: string;
  data: Post[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface PostDetailResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface PostMutationResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface DeletePostResponse {
  success: boolean;
  message: string;
}
