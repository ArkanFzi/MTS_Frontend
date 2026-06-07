// ─── 1. TIPE DATA USER GLOBAL ───
// Diverifikasi langsung dari skema database model App\Models\User (UUID-based)
export interface User {
  id: string;                  // UUID (HasUuids)
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  reputation_points: number;
  level: number;
  is_banned: boolean;
  role?: 'user' | 'moderator' | 'admin'; // Di-inject dari relasi Spatie / Role system
  created_at?: string;
  updated_at?: string;
}

// ─── 2. TIPE DATA KATEGORI (SHARED MODEL) ───
// Sesuai dengan entitas kategori postingan forum
export interface Category {
  id: string;                  // UUID
  name: string;
  slug: string;
  description: string | null;
  posts_count?: number;        // Opsional untuk statistik di UI
}

// ─── 3. TIPE DATA TAG (SHARED MODEL) ───
// Sesuai dengan entitas tag yang membawa kode warna hex unik dari database
export interface Tag {
  id: string;                  // UUID
  name: string;
  slug: string;
  color: string;               // Menyimpan kode HEX (contoh: #D4AF37 atau #E53E3E)
  posts_count?: number;
}

// ─── 4. WRAPPER PAGINATION GLOBAL (STANDAR LARAVEL API API RESOURCE) ───
// Digunakan oleh fitur seperti Search, Home Feed, Trending, dll.
export interface PaginatedResponse<T> {
  data: T[];                   // Array data utama (misal: SearchResultItem[], Post[])
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  
  // Struktur links bawaan API Resource Laravel (jika kamu membutuhkannya nanti)
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// ─── 5. WRAPPER RESPONSE API STANDAR (NON-PAGINATED) ───
// Digunakan untuk response tunggal seperti POST, PUT, DELETE, atau GET Detail
export interface BaseApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}