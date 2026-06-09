// src/features/Common/F6_FilterByCategory/types/index.ts
import type { Category, Tag, User } from '../../../../types';

export interface CategoryPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  votes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  user: User;
  category: Category;
  tags: Tag[];
}

export interface CategoryDetailData {
  category: Category;
  posts: {
    current_page: number;
    data: CategoryPost[];
    last_page: number;
    per_page: number;
    total: number;
  };
}
