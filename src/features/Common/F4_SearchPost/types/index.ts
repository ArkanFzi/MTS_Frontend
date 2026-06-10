// src/features/Common/F4_SearchPost/types/index.ts

export interface SearchQuery {
  q: string;
  page?: number;
  sort?: string;
  category?: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  body: string;
  status: 'open' | 'closed';
  vote_score: number;
  view_count: number;
  comments_count: number;
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
    color: string | null;
  }[];
}

export interface SearchResponse {
  status: string;
  message: string;
  data: SearchResultItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
