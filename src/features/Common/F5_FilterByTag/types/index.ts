import type { Category, Tag, User } from "../../../../types";

export interface TagPost {
  id: string;
  title: string;
  body: string;
  vote_score: number;
  comments_count: number;
  view_count: number;
  is_answered: boolean;
  created_at: string;
  user: User;
  category: Category;
  tags: Tag[];
}

export interface TagInfo {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  usage_count: number;
  created_at: string;
}

export interface TagPostsResponse {
  status: string;
  message: string;
  data: TagPost[];
  tag: TagInfo | null;
  categories: { id: string; name: string; slug: string }[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
