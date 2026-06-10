// TODO: TypeScript interfaces for F24_BookmarkPost
// src/features/User/F24_BookmarkPost/types/index.ts

/**
 * Interface untuk data User / Aktor yang membuat postingan asal
 */
export interface BookmarkActor {
  id: string;
  username: string;
  avatar_url?: string;
}

/**
 * Interface untuk detail objek Postingan yang disimpan di dalam bookmark
 */
export interface BookmarkedPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  created_at: string;
  author: BookmarkActor;
}

/**
 * Interface Utama untuk item Bookmark (Response dari API `/api/bookmarks`)
 * Menampung metadata bookmark seperti catatan khusus dan waktu penyimpanan
 */
export interface BookmarkItem {
  id: string;
  user_id: string;      // ID User yang menyimpan bookmark
  post_id: string;      // ID Postingan yang disimpan
  notes?: string;       // Catatan opsional yang di-input melalui Formik & disimpan ke DB
  created_at: string;   // Waktu kapan postingan ini di-bookmark
  updated_at: string;
  post: BookmarkedPost; // Relasi data objek postingan dari backend Laravel
}