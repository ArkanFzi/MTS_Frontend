// ─── src/types/index.ts ───
// Dokumen Verifikasi: KEY TYPESCRIPT INTERFACES GLOBAL

export interface User {
  id: string; // UUID (HasUuids)
  username: string;
  email: string;
  avatar_url: string | null; // Sesuai F28
  bio: string | null; // Sesuai F28 (Bio / Expertise)
  reputation_points: number; // Untuk stats di settings
  level: number; // Untuk stats di settings
  is_banned: boolean;
  role?: string; // Dari relasi roles (inject di response)
  created_at: string; // ISO 8601 datetime string
  updated_at: string;
}

// ─── src/features/User/F28_ProfileSettings/types/index.ts ───
// Dokumen Verifikasi: PAGE 16 -> TypeScript Interface (F28_ProfileSettings)

/**
 * Response dari GET /api/settings/profile
 * Memuat detail profil penuh dan stats
 */
export interface ProfileData {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null; // Sesuai "Bio / Expertise" di UI
  reputation_points: number; // Suhu stats
  level: number;             // Suhu stats
  posts_count: number;       // Stats
  badges_count: number;      // Stats
}

/**
 * Payload untuk PUT /api/settings/profile
 * Partial update: user hanya perlu mengisi apa yang ingin diubah.
 */
export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  avatar_url?: string; // URL final dari storage
}

/**
 * Payload untuk PUT /api/settings/password
 */
export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Tipe umum API Response wrapper (Shared)
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
