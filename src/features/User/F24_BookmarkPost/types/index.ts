// src/features/User/F24_BookmarkPost/types/index.ts
import type { Post } from '../../F16_Post/types/index';

export interface BookmarkPayload {
  post_id: string;
}

export interface BookmarkItem {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  post?: Post;
}

export interface ToggleBookmarkResponse {
  success: boolean;
  message: string;
  data: {
    is_bookmarked: boolean;
  };
}

export interface BookmarkListResponse {
  status: string;
  message: string;
  data: BookmarkItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
