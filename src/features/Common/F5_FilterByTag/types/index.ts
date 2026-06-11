// src/features/Common/F5_FilterByTag/types/index.ts

export interface TagPost {
  id: string;
  title: string;
  body: string;
  vote_score: number;
  comments_count: number;
  view_count: number;
  is_answered: boolean;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
    color: string;
  }[];
}

export interface TagInfo {
  id: string;
  name: string;
  slug: string;
  color: string;
  usage_count: number;
  created_at: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export interface TagPostsResponse {
  status: string;
  message: string;
  data: TagPost[];
  tag: TagInfo | null;
  categories: CategoryOption[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
