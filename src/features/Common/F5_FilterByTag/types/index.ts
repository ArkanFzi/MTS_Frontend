import type { Category, Tag, User } from "../../../../types";


export interface TagPost {
  id: string; // UUID format
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

export interface TagDetailData {
  tag: Tag;
  posts: {
    current_page: number;
    data: TagPost[];
    last_page: number;
    per_page: number;
    total: number;
  };
}