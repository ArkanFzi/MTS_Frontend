// src/features/Common/F4_SearchPost/types/index.ts
import type { PaginatedResponse } from "../../../../types"; // Pastikan path benar

export interface SearchQuery {
  q: string;
  page?: number;
  sort?: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  body: string;
  status: 'open' | 'closed';
  vote_score: number;
  view_count: number;
  comments_count: number;
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

// Gunakan PaginatedResponse yang sudah kita perbaiki di atas
export type SearchResponse = PaginatedResponse<SearchResultItem>;