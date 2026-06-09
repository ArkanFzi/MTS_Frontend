// src/features/Common/F7_TrendingPopularPost/types/index.ts
import type { Category, Tag, User } from '../../../../types';

export interface TrendingPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  status: string;
  vote_score: number;
  view_count: number;
  comments_count: number;
  is_answered: boolean;
  created_at: string;
  user: User;
  category: Category;
  tags: Tag[];
}

export interface TrendingResponse {
  status: string;
  message: string;
  data: TrendingPost[];
}
