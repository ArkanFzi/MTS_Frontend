import type { Category, Tag, User } from "../../../../types";

export interface TagPost {
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

export interface TagPostsResponse {
  status: string;
  message: string;
  data: TagPost[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}