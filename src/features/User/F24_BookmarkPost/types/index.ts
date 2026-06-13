// src/features/User/F24_BookmarkPost/types/index.ts

export interface BookmarkUser {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface BookmarkedPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
  user: BookmarkUser; // backend loads post.user (not post.author)
}

export interface BookmarkItem {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
  updated_at: string;
  post: BookmarkedPost;
}

export interface ToggleBookmarkResponse {
  message: string;
  status: string; // 'bookmarked' | 'unbookmarked'
}


export interface BookmarkCardProps {
  item: any;
}