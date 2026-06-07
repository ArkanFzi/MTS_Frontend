 // Mengambil wrapper pagination global

import type { PaginatedResponse } from "../../../../types";

export interface SearchQuery {
  q: string;
  page?: number;
  sort?: string; // Tambahan opsional untuk UI sorting
}

export interface SearchResultItem {
  id: string;
  title: string;
  body: string;              // excerpt / truncated
  status: 'published';
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
    color: string;
  }[];
}

// Tipe kembalian spesifik untuk endpoint search
export type SearchResponse = PaginatedResponse<SearchResultItem>;