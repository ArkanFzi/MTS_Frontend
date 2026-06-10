// src/features/Common/F6_FilterByCategory/types/index.ts
import type { Category, Tag, User } from '../../../../types';

export interface CategoryPost {
  id: string;
  title: string;
  body: string;
  vote_score: number;
  comments_count?: number;
  view_count: number;
  created_at: string;
  user: User;
  category: Category;
  tags: Tag[];
}

export interface CategoryPostsResponse {
  status: string;
  message: string;
  data: CategoryPost[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
