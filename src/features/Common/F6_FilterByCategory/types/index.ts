// src/features/Common/F6_FilterByCategory/types/index.ts

export interface TagInfo {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  posts_count: number;
}

export interface CategoryWithTags {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
  tags: TagInfo[];
}

export interface CategoriesWithTagsResponse {
  status: string;
  data: CategoryWithTags[];
}

export interface CategoryPost {
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

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface CategoryTagOption {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}

export interface CategoryPostsResponse {
  status: string;
  message: string;
  data: CategoryPost[];
  category: CategoryInfo | null;
  tags: CategoryTagOption[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
