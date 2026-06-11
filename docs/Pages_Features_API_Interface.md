# 📋 Dokumentasi Lengkap: Pages, Features, API & TypeScript Interface
**Project:** MTS (Forum Community System)
**Versi:** 1.0 — Final
**Tanggal:** 7 Juni 2026

Dokumen ini adalah **panduan coding utama** yang menjembatani halaman (pages), fitur (features), endpoint API Backend Laravel, dan TypeScript Interface yang harus diimplementasikan di `src/features/[Domain]/[F]/types/index.ts`.

> Setiap baris interface TypeScript di dokumen ini **diverifikasi langsung** dari model Eloquent di `MTS_backend/app/Models/`.

---

## 📐 PANDUAN MEMBACA DOKUMEN INI

Setiap halaman didokumentasikan dengan format:

```
### [Nama Halaman] — (Nomor PAGE)
- Rute: /url/path
- Fitur yang terlibat: daftar F-code
- API yang dipanggil: tabel endpoint
- TypeScript Interface: definisi tipe data
- Komponen utama: yang dipakai di halaman ini
```

---

## 🔑 TYPESCRIPT INTERFACES GLOBAL (`src/types/index.ts`)

Sebelum masuk ke halaman, definisi tipe data *shared* yang dipakai di banyak tempat:

```typescript
// src/types/index.ts

// ─── Tipe dasar dari tabel users ───
export interface User {
  id: string;          // UUID (HasUuids)
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  reputation_points: number;
  level: number;
  is_banned: boolean;
  role?: string;       // Dari relasi roles (inject di response)
  created_at: string;  // ISO 8601 datetime string
  updated_at: string;
}

// ─── Tipe dari tabel roles ───
export interface Role {
  id: string;
  name: string;        // 'admin' | 'moderator' | 'user'
  permissions: Record<string, boolean>; // JSON column
}

// ─── Tipe dari tabel categories ───
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
}

// ─── Tipe dari tabel tags ───
export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;       // hex color, e.g: "#D4AF37"
  usage_count: number;
}

// ─── Tipe dari tabel posts ───
export interface Post {
  id: string;          // UUID
  user_id: string;
  category_id: string;
  title: string;
  body: string;
  status: 'open' | 'closed';  // Status aktual: 'open' (aktif) atau 'closed' (ditutup)
  view_count: number;
  vote_score: number;
  is_answered: boolean;
  accepted_answer_id: string | null;
  created_at: string;
  updated_at: string;
  // Relasi yang di-load eager
  user?: User;
  category?: Category;
  tags?: Tag[];
  comments_count?: number;
}

// ─── Tipe dari tabel comments ───
export interface Comment {
  id: string;          // UUID
  post_id: string;
  user_id: string;
  parent_id: string | null; // null = root comment, ada isi = nested reply
  body: string;
  vote_score: number;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
  // Relasi eager
  user?: User;
  replies?: Comment[];
}

// ─── Tipe dari tabel badges ───
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  condition_type: string;
  condition_value: number;
  earned_at?: string;  // Pivot: user_badges.earned_at
}

// ─── Tipe dari tabel reports ───
export interface Report {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: 'post' | 'comment' | 'user';
  reason: string;
  description: string | null;
  status: 'pending' | 'resolved' | 'rejected';
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
  reporter?: User;
}

// ─── Tipe dari tabel moderation_logs ───
export interface ModerationLog {
  id: string;
  moderator_id: string;
  target_user_id: string;
  action_type: string;
  reason: string;
  notes: string | null;
  created_at: string;
  moderator?: User;
  target_user?: User;
}

// ─── Tipe dari tabel notifications ───
export interface Notification {
  id: string;
  user_id: string;       // Penerima notifikasi
  actor_id: string | null;  // User yang memicu aksi
  type: string;          // 'upvote_post', 'new_comment', 'badge_awarded', dll
  reference_id: string | null;
  reference_type: string | null;  // 'post', 'comment', 'badge', dll
  is_read: boolean;      // Status baca (default: false)
  created_at: string;
  actor?: User;          // Relasi eager load
}

// ─── Tipe dari tabel post_edit_history ───
export interface PostEditHistory {
  id: string;
  post_id: string;
  edited_by: string;
  body_before: string;
  body_after: string;
  reason: string;
  edited_at: string;
  editor?: User;
}

// ─── Tipe dari tabel comment_edit_history ───
export interface CommentEditHistory {
  id: string;
  comment_id: string;
  edited_by: string;
  body_before: string;
  body_after: string;
  edited_at: string;
  editor?: User;
}

// ─── Tipe umum API Response wrapper ───
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ─── Auth (Sanctum SPA Cookie-Based) ───
// TIDAK ADA token yang dikirim — sesi dikelola via HttpOnly cookie otomatis.
// Frontend Axios: withCredentials: true
// Backend: $middleware->statefulApi()
export interface AuthResponse {
  status: string;   // 'success' | 'error'
  message: string;
  data: {
    user: User & { roles: string[] };
  };
}
```

---

## 🔐 HALAMAN AUTH

---

### PAGE 1 — RegisterPage (`/register`)
**File:** `src/pages/Auth/RegisterPage.tsx`
**Features:** `F1_Register`
**Layout:** `AppLayout` (unified — GuestRoute redirect jika sudah login)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `POST` | `/api/auth/register` | Publik | Submit form registrasi |

#### TypeScript Interface (`features/Auth/F1_Register/types/index.ts`):
```typescript
// REQUEST payload ke POST /api/auth/register
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// RESPONSE dari API jika berhasil
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// State form validation error
export interface RegisterFormErrors {
  username?: string[];
  email?: string[];
  password?: string[];
}
```

#### Komponen Utama:
- `features/Auth/F1_Register/components/RegisterForm.tsx` — Form input utama
- `features/Auth/F1_Register/components/TermsCheckbox.tsx` — Checkbox T&C
- `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/card.tsx`

---

### PAGE 2 — LoginPage (`/login`)
**File:** `src/pages/Auth/LoginPage.tsx`
**Features:** `F2_Login`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `POST` | `/api/auth/login` | Publik | Submit kredensial login |

#### TypeScript Interface (`features/Auth/F2_Login/types/index.ts`):
```typescript
// REQUEST payload ke POST /api/auth/login
export interface LoginPayload {
  email: string;
  password: string;
}

// RESPONSE saat login berhasil (simpan ke localStorage/context)
export interface LoginResponse {
  token: string;
  user: import('@/types').User;
}

// State form error
export interface LoginFormErrors {
  email?: string[];
  password?: string[];
  general?: string; // "The provided credentials are incorrect"
}
```

#### Komponen Utama:
- `features/Auth/F2_Login/components/LoginForm.tsx`
- `components/ui/button.tsx`, `components/ui/input.tsx`

---

### KOMPONEN GLOBAL — LogoutButton (bukan halaman)
**File:** `features/Auth/F3_Logout/components/LogoutButton.tsx`
**Dipakai di:** Semua halaman via `AppLayout` (unified sidebar)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `POST` | `/api/auth/logout` | 🔒 Sanctum | Hancurkan token di server |

#### TypeScript Interface (`features/Auth/F3_Logout/types/index.ts`):
```typescript
// RESPONSE dari POST /api/auth/logout
export interface LogoutResponse {
  message: string; // "Logged out successfully"
}
```

---

## 🌐 HALAMAN PUBLIC / EXPLORE

---

### PAGE 3 — HomePage (`/`)
**File:** `src/pages/Public/HomePage.tsx`
**Features:** `F16_Post` (feed) + `F7_TrendingPopularPost` + `F5_FilterByTag` + `F22_VoteSystem` + `F23_LikeSystem`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/posts` | Publik | Feed timeline semua postingan |
| 2 | `GET` | `/api/explore/trending` | Publik | Daftar postingan trending (sidebar) |
| 3 | `GET` | `/api/explore/tags` | Publik | Daftar semua tag untuk filter chip |
| 4 | `POST` | `/api/votes` | 🔒 Sanctum | Upvote/downvote dari card post |
| 5 | `POST` | `/api/likes/toggle` | 🔒 Sanctum | Like/unlike dari card post |

#### TypeScript Interface:
```typescript
// features/User/F16_Post/types/index.ts
export interface PostListItem extends import('@/types').Post {
  // Tambahan field yang di-inject response untuk optimasi feed
  like_count: number;
  is_liked: boolean;       // boolean relatif terhadap user yang login
  is_bookmarked: boolean;  // boolean relatif terhadap user yang login
  user_vote: 1 | -1 | 0;  // vote aktif user saat ini
}

// features/Common/F7_TrendingPopularPost/types/index.ts
export interface TrendingPost {
  id: string;
  title: string;
  vote_score: number;
  view_count: number;
  comments_count: number;
  created_at: string;
}

// features/User/F22_VoteSystem/types/index.ts
export interface VotePayload {
  votable_id: string;
  votable_type: 'post' | 'comment';
  value: 1 | -1;
}

export interface VoteResponse {
  new_score: number;
  user_vote: 1 | -1 | 0;
}

// features/User/F23_LikeSystem/types/index.ts
export interface LikePayload {
  likeable_id: string;
  likeable_type: 'post' | 'comment';
}

export interface LikeResponse {
  liked: boolean; // true = baru di-like, false = un-like
  like_count: number;
}
```

#### Komponen Utama:
- `features/User/F16_Post/components/PostCardItem.tsx` — Card di feed
- `features/Common/F7_TrendingPopularPost/components/TrendingSidebar.tsx` — Sidebar kanan
- `features/User/F22_VoteSystem/components/VoteControl.tsx` — Tombol ↑/↓ di card
- `features/User/F23_LikeSystem/components/LikeButton.tsx` — Tombol ❤️

---

### PAGE 4 — PostDetailPage (`/posts/:postId`)
**File:** `src/pages/Public/PostDetailPage.tsx`
**Features:** `F16_Post` + `F17_Comment` + `F18_MarkAcceptedAnswer` + `F20_NestedCommentReply` + `F22_VoteSystem` + `F23_LikeSystem` + `F30_UserReport`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/posts/{post}` | Publik | Detail postingan + metadata |
| 2 | `GET` | `/api/posts/{post}/comments` | Publik | Seluruh comment tree |
| 3 | `POST` | `/api/posts/{post}/comments` | 🔒 Sanctum | Tambah komentar baru |
| 4 | `PUT` | `/api/posts/{post}/comments/{comment}` | 🔒 Sanctum | Edit komentar |
| 5 | `POST` | `/api/posts/{post}/comments/{comment}/replies` | 🔒 Sanctum | Tambah balasan nested |
| 6 | `PUT` | `/api/posts/{post}/comments/{comment}/replies/{reply}` | 🔒 Sanctum | Edit balasan |
| 7 | `POST` | `/api/posts/{post}/comments/{comment}/accept` | 🔒 Sanctum (hanya OP) | Tandai jawaban terbaik |
| 8 | `POST` | `/api/votes` | 🔒 Sanctum | Vote pada post atau komentar |
| 9 | `POST` | `/api/likes/toggle` | 🔒 Sanctum | Like pada post |
| 10 | `POST` | `/api/reports` | 🔒 Sanctum | Laporkan post/komentar |

#### TypeScript Interface:
```typescript
// features/User/F17_Comment/types/index.ts
export interface CreateCommentPayload {
  body: string;
}

export interface UpdateCommentPayload {
  body: string;
}

// Nested comment tree (rekursif)
export interface CommentNode extends import('@/types').Comment {
  replies: CommentNode[];
  like_count: number;
  is_liked: boolean;
  user_vote: 1 | -1 | 0;
}

// features/User/F18_MarkAcceptedAnswer/types/index.ts
export interface AcceptAnswerResponse {
  message: string;
  comment_id: string;
  is_answered: boolean; // Post di-update jadi is_answered: true
}

// features/User/F20_NestedCommentReply/types/index.ts
export interface CreateReplyPayload {
  body: string;
  parent_id: string; // ID comment yang dibalas
}

// features/User/F30_UserReport/types/index.ts
export type ReportableType = 'post' | 'comment' | 'user';

export interface CreateReportPayload {
  reportable_id: string;  // ID objek yang dilaporkan
  reportable_type: ReportableType;
  reason: string;
  description?: string;
}
```

#### Komponen Utama:
- `features/User/F17_Comment/components/CommentList.tsx`
- `features/User/F17_Comment/components/ReplyForm.tsx`
- `features/User/F18_MarkAcceptedAnswer/components/AcceptAnswerButton.tsx`
- `features/User/F20_NestedCommentReply/components/NestedReplyList.tsx`
- `features/User/F22_VoteSystem/components/VoteControl.tsx`
- `features/User/F30_UserReport/components/ReportUserModal.tsx`

---

### PAGE 5 — SearchPage (`/search`)
**File:** `src/pages/Public/SearchPage.tsx`
**Features:** `F4_SearchPost`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Query Param |
|---|--------|----------|-------|-------------|
| 1 | `GET` | `/api/explore/search` | Publik | `?q={keyword}` |

#### TypeScript Interface (`features/Common/F4_SearchPost/types/index.ts`):
```typescript
export interface SearchQuery {
  q: string;
  page?: number;
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
```

---

### PAGE 6 — TagFilterPage (`/tags/:slug`)
**File:** `src/pages/Public/TagFilterPage.tsx`
**Features:** `F5_FilterByTag`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/explore/tag/{slug}` | Publik | Post berdasarkan tag slug |

#### TypeScript Interface (`features/Common/F5_FilterByTag/types/index.ts`):
```typescript
export interface TagFilterParams {
  slug: string;
  page?: number;
}

export interface TagWithPosts {
  tag: import('@/types').Tag;
  posts: import('@/types').Post[];
  total: number;
}
```

---

### PAGE 7 — CategoryFilterPage (`/category/:slug`)
**File:** `src/pages/Public/CategoryFilterPage.tsx`
**Features:** `F6_FilterByCategory`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/explore/category/{slug}` | Publik | Post berdasarkan kategori slug |

#### TypeScript Interface (`features/Common/F6_FilterByCategory/types/index.ts`):
```typescript
export interface CategoryFilterParams {
  slug: string;
  page?: number;
}

export interface CategoryWithPosts {
  category: import('@/types').Category;
  posts: import('@/types').Post[];
  total: number;
}
```

---

### PAGE 8 — TrendingPage (`/trending`)
**File:** `src/pages/Public/TrendingPage.tsx`
**Features:** `F7_TrendingPopularPost`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Query Param |
|---|--------|----------|-------|-------------|
| 1 | `GET` | `/api/explore/trending` | Publik | `?limit=20` (opsional) |

#### TypeScript Interface (`features/Common/F7_TrendingPopularPost/types/index.ts`):
```typescript
export interface TrendingPost {
  id: string;
  title: string;
  vote_score: number;
  view_count: number;
  comments_count: number;
  like_count: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  tags: {
    name: string;
    color: string;
  }[];
}
```

---

### PAGE 9 — LeaderboardPage (`/leaderboard`)
**File:** `src/pages/Public/LeaderboardPage.tsx`
**Features:** `F27_GamificationLeaderboard`
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/explore/leaderboard` | Publik | Top 10/50 user berdasarkan reputation_points |

#### TypeScript Interface (`features/User/F27_GamificationLeaderboard/types/index.ts`):
```typescript
export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatar_url: string | null;
    reputation_points: number;
    level: number;
  };
  posts_count: number;
  accepted_answers_count: number;
}
```

#### Komponen Utama:
- `features/User/F27_GamificationLeaderboard/components/LeaderboardTable.tsx`
- `features/User/F27_GamificationLeaderboard/components/RankCard.tsx` — Podium TOP 3

---

### PAGE 10 — TagsListPage (`/tags`)
**File:** `src/pages/Public/TagsListPage.tsx`
**Features:** `F12_TagMaster` (read-only view)
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/explore/tags` | Publik | Semua tag + usage_count |

---

## 👤 HALAMAN USER (LOGIN REQUIRED)

---

### PAGE 11 — CreatePostPage (`/posts/new`)
**File:** `src/pages/User/CreatePostPage.tsx`
**Features:** `F16_Post` (Create)
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `POST` | `/api/posts` | 🔒 Sanctum | Submit form post baru |
| 2 | `GET` | `/api/explore/tags` | Publik | Populate pilihan tag |
| 3 | `POST` | `/api/tags` | 🔒 Sanctum | Buat tag baru jika belum ada |

#### TypeScript Interface (`features/User/F16_Post/types/index.ts`):
```typescript
// Payload untuk membuat post baru
export interface CreatePostPayload {
  title: string;
  body: string;
  category_id: string;
  tags: string[];  // array nama tag (bukan ID)
  status: 'open' | 'closed';
}

// Payload untuk mengedit post
export interface UpdatePostPayload {
  title?: string;
  body?: string;
  category_id?: string;
  tags?: string[];
}

// Payload update status
export interface UpdatePostStatusPayload {
  status: 'open' | 'closed';
}

// Response setelah berhasil create
export interface CreatePostResponse {
  message: string;
  post: import('@/types').Post;
}
```

#### Komponen Utama:
- `features/User/F16_Post/components/CreatePostForm.tsx` — Form dengan rich text editor

---

### PAGE 12 — EditPostPage (`/posts/:postId/edit`)
**File:** `src/pages/User/EditPostPage.tsx`
**Features:** `F16_Post` (Edit)
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/posts/{post}` | Publik | Pre-fill form dengan data lama |
| 2 | `PUT` | `/api/posts/{post}` | 🔒 Sanctum (hanya pemilik) | Submit revisi |

#### Komponen Utama:
- `features/User/F16_Post/components/EditPostForm.tsx`

---

### PAGE 13 — MyPostsPage (`/me/posts`)
**File:** `src/pages/User/MyPostsPage.tsx`
**Features:** `F16_Post` (My Posts)
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/me/posts` | 🔒 Sanctum | Semua post milik user yang login |
| 2 | `DELETE` | `/api/posts/{post}` | 🔒 Sanctum | Hapus post sendiri |
| 3 | `PATCH` | `/api/posts/{post}/status` | 🔒 Sanctum | Toggle open/closed |

---

### PAGE 14 — BookmarksPage (`/me/bookmarks`)
**File:** `src/pages/User/BookmarksPage.tsx`
**Features:** `F24_BookmarkPost`
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/bookmarks` | 🔒 Sanctum | Semua post yang sudah di-bookmark |
| 2 | `POST` | `/api/bookmarks/toggle` | 🔒 Sanctum | Hapus bookmark dari halaman ini |

#### TypeScript Interface (`features/User/F24_BookmarkPost/types/index.ts`):
```typescript
// Dari tabel bookmarks: user_id, post_id, created_at
export interface BookmarkItem {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
  post: import('@/types').Post; // eager loaded
}

export interface BookmarkTogglePayload {
  post_id: string;
}

export interface BookmarkToggleResponse {
  bookmarked: boolean; // true = baru di-save, false = dihapus
}
```

#### Komponen Utama:
- `features/User/F24_BookmarkPost/components/BookmarkToggle.tsx` — Tombol ikon bookmark

---

### PAGE 15 — NotificationsPage (`/me/notifications`)
**File:** `src/pages/User/NotificationsPage.tsx`
**Features:** `F26_NotificationSystem`
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/notifications` | 🔒 Sanctum | Semua notifikasi masuk |
| 2 | `PATCH` | `/api/notifications/mark-all-read` | 🔒 Sanctum | Tandai semua sudah dibaca |
| 3 | `PATCH` | `/api/notifications/{id}/read` | 🔒 Sanctum | Tandai satu notifikasi |

#### TypeScript Interface (`features/User/F26_NotificationSystem/types/index.ts`):
```typescript
// Dari tabel notifications
export interface NotificationItem extends import('@/types').Notification {
  // data field berisi payload dinamis tergantung type
  data: {
    message: string;
    link?: string;        // URL redirect saat klik
    actor?: {            // User yang memicu notifikasi
      id: string;
      username: string;
      avatar_url: string | null;
    };
    post_id?: string;
    comment_id?: string;
  };
}

export interface MarkReadResponse {
  message: string;
  unread_count: number;
}
```

#### Komponen Utama:
- `features/User/F26_NotificationSystem/components/NotificationRow.tsx`

---

### PAGE 16 — ProfileSettingsPage (`/me/settings`)
**File:** `src/pages/User/ProfileSettingsPage.tsx`
**Features:** `F28_ProfileSettings`
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/settings/profile` | 🔒 Sanctum | Ambil data profil sendiri |
| 2 | `PUT` | `/api/settings/profile` | 🔒 Sanctum | Update username/bio/avatar |
| 3 | `PUT` | `/api/settings/password` | 🔒 Sanctum | Ganti password |

#### TypeScript Interface (`features/User/F28_ProfileSettings/types/index.ts`):
```typescript
// GET /api/settings/profile — response
export interface ProfileData {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  reputation_points: number;
  level: number;
  posts_count: number;
  badges_count: number;
}

// PUT /api/settings/profile — payload
export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  avatar_url?: string; // URL yang sudah di-upload ke storage
}

// PUT /api/settings/password — payload
export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
```

#### Komponen Utama:
- `features/User/F28_ProfileSettings/components/SettingsForm.tsx`

---

### PAGE 17 — PublicProfilePage (`/profile/:username`)
**File:** `src/pages/User/PublicProfilePage.tsx`
**Features:** `F25_FollowUser` + *(data profil via settings endpoint)*
**Layout:** `AppLayout` (GuestRoute)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/settings/profile` + param | Publik | Data profil user publik berdasarkan username |
| 2 | `GET` | `/api/users/{id}/followers` | Publik | Daftar pengikut user |
| 3 | `GET` | `/api/users/{id}/following` | Publik | Daftar yang diikuti user |
| 4 | `POST` | `/api/users/{id}/follow` | 🔒 Sanctum | Follow / Unfollow |
| 5 | `GET` | `/api/me/posts` filtered | 🔒 Sanctum | Post milik user ini |

#### TypeScript Interface (`features/User/F25_FollowUser/types/index.ts`):
```typescript
// Response dari POST /api/users/{id}/follow
export interface FollowToggleResponse {
  following: boolean;    // true = sekarang follow, false = unfollow
  followers_count: number;
}

// Daftar follower/following
export interface FollowUser {
  id: string;
  username: string;
  avatar_url: string | null;
  reputation_points: number;
}
```

#### Komponen Utama:
- `features/User/F25_FollowUser/components/FollowButton.tsx`

---

### PAGE 18 — MyBadgesPage (`/me/badges`)
**File:** `src/pages/User/MyBadgesPage.tsx`
**Features:** `F29_BadgeAchievement`
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/me/badges` | 🔒 Sanctum | Koleksi badge yang berhasil diraih |

#### TypeScript Interface (`features/User/F29_BadgeAchievement/types/index.ts`):
```typescript
// Response dari GET /api/me/badges
// Berisi data dari tabel badges + pivot user_badges
export interface EarnedBadge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  condition_type: string;
  condition_value: number;
  earned_at: string; // dari user_badges.earned_at
}
```

#### Komponen Utama:
- `features/User/F29_BadgeAchievement/components/BadgeGridDisplay.tsx`

---

### PAGE ✨ — PostEditHistoryPage (`/posts/:postId/history`)
**File:** `src/pages/User/PostEditHistoryPage.tsx`
**Features:** `F19_PostEditHistory`
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/moderator/posts/{post}/history` | 🔒 Moderator/Admin | Timeline revisi teks postingan |

#### TypeScript Interface (`features/User/F19_PostEditHistory/types/index.ts`):
```typescript
// Dari tabel post_edit_history
export interface PostEditHistoryItem {
  id: string;
  post_id: string;
  edited_by: string;
  body_before: string;  // Teks sebelum diedit (tampilkan diff)
  body_after: string;   // Teks setelah diedit (tampilkan diff)
  reason: string;       // Alasan edit yang wajib diisi
  edited_at: string;
  editor: {            // Eager loaded dari edited_by foreign key
    id: string;
    username: string;
    avatar_url: string | null;
  };
}
```

#### Komponen Utama:
- `features/User/F19_PostEditHistory/components/PostHistoryDiff.tsx` — Side-by-side diff viewer

---

### PAGE ✨ — CommentEditHistoryPage (`/comments/:commentId/history`)
**File:** `src/pages/User/CommentEditHistoryPage.tsx`
**Features:** `F21_CommentEditHistory`
**Layout:** `AppLayout` (ProtectedRoute — auth)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/moderator/comments/{comment}/history` | 🔒 Moderator/Admin | Timeline revisi teks komentar |

#### TypeScript Interface (`features/User/F21_CommentEditHistory/types/index.ts`):
```typescript
// Dari tabel comment_edit_history
export interface CommentEditHistoryItem {
  id: string;
  comment_id: string;
  edited_by: string;
  body_before: string;
  body_after: string;
  edited_at: string;
  editor: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}
```

---

## 🛡️ HALAMAN MODERATOR

---

### PAGE 19 — ReportQueuePage (`/moderator/reports`)
**File:** `src/pages/Moderator/ReportQueuePage.tsx`
**Features:** `F13_ContentReportQueue`
**Layout:** `AppLayout` (ProtectedRoute — mod+admin)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/moderator/reports` | 🔒 Moderator/Admin | List semua tiket laporan |
| 2 | `GET` | `/api/moderator/reports/{id}` | 🔒 Moderator/Admin | Detail satu laporan |
| 3 | `PUT` | `/api/moderator/reports/{id}` | 🔒 Moderator/Admin | Update status laporan |

#### TypeScript Interface (`features/Moderator/F13_ReportQueue/types/index.ts`):
```typescript
// Dari tabel reports
export interface ReportQueueItem extends import('@/types').Report {
  reporter: import('@/types').User;
  // target bisa Post atau Comment (polymorphic)
  target_preview: string; // Cuplikan konten yang dilaporkan
}

// Payload untuk PUT /api/moderator/reports/{id}
export interface ResolveReportPayload {
  status: 'resolved' | 'rejected';
  action_taken?: string; // Catatan tindakan
}

export type ReportStatus = 'pending' | 'resolved' | 'rejected';
```

#### Komponen Utama:
- `features/Moderator/F13_ReportQueue/components/ReportListRow.tsx`
- `features/Moderator/F13_ReportQueue/components/ActionReasonModal.tsx`

---

### PAGE 20 — ActionLogPage (`/moderator/logs`)
**File:** `src/pages/Moderator/ActionLogPage.tsx`
**Features:** `F14_ModeratorActionLog`
**Layout:** `AppLayout` (ProtectedRoute — mod+admin)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/moderator/logs` | 🔒 Moderator/Admin | Log semua keputusan moderasi |

#### TypeScript Interface (`features/Moderator/F14_ModeratorActionLog/types/index.ts`):
```typescript
// Dari tabel moderation_logs
export interface ModActionLog extends import('@/types').ModerationLog {
  moderator: import('@/types').User;
  target_user: import('@/types').User;
}
```

---

### PAGE 21 — BanManagementPage (`/moderator/bans`)
**File:** `src/pages/Moderator/BanManagementPage.tsx`
**Features:** `F15_UserBanSanction`
**Layout:** `AppLayout` (ProtectedRoute — mod+admin)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/moderator/bans` | 🔒 Moderator/Admin | Daftar user yang sedang dibanned |
| 2 | `POST` | `/api/moderator/bans/{id}/warn |
| POST | /api/moderator/bans/{id}/ban` | 🔒 Moderator/Admin | Eksekusi ban |
| 3 | `POST` | `/api/moderator/bans/{id}/unban` | 🔒 Moderator/Admin | Cabut ban |

#### TypeScript Interface (`features/Moderator/F15_UserBanSanction/types/index.ts`):
```typescript
export interface BannedUser {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  is_banned: boolean;
  ban_reason?: string;   // Jika disimpan di DB
  banned_at?: string;
}

export interface BanPayload {
  reason: string;
  duration_days?: number; // null = permanent
}

export interface BanResponse {
  message: string;
  user: {
    id: string;
    is_banned: boolean;
  };
}
```

#### Komponen Utama:
- `features/Moderator/F15_UserBanSanction/components/BanControlForm.tsx`

---

### PAGE 22 — ModTagCategoryPage (`/moderator/content`)
**File:** `src/pages/Moderator/ModTagCategoryPage.tsx`
**Features:** `F10_CategoryMaster` + `F12_TagMaster`
**Layout:** `AppLayout` (ProtectedRoute — mod+admin)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/moderator/categories` | 🔒 Mod/Admin | List semua kategori |
| 2 | `POST` | `/api/moderator/categories` | 🔒 Mod/Admin | Buat kategori baru |
| 3 | `PUT` | `/api/moderator/categories/{id}` | 🔒 Mod/Admin | Edit kategori |
| 4 | `DELETE` | `/api/moderator/categories/{id}` | 🔒 Mod/Admin | Hapus kategori |
| 5 | `GET` | `/api/moderator/tags` | 🔒 Mod/Admin | List semua tag master |
| 6 | `POST` | `/api/moderator/tags` | 🔒 Mod/Admin | Buat tag baru |
| 7 | `PUT` | `/api/moderator/tags/{id}` | 🔒 Mod/Admin | Edit nama/warna tag |
| 8 | `DELETE` | `/api/moderator/tags/{id}` | 🔒 Mod/Admin | Hapus tag |

---

### PAGE 23 — EditHistoryPage (`/moderator/history`)
**File:** `src/pages/Moderator/EditHistoryPage.tsx`
**Features:** `F19_PostEditHistory` + `F21_CommentEditHistory`
**Layout:** `AppLayout` (ProtectedRoute — mod+admin)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/moderator/posts/{post}/history` | 🔒 Mod/Admin | Riwayat edit post |
| 2 | `GET` | `/api/moderator/comments/{comment}/history` | 🔒 Mod/Admin | Riwayat edit komentar |

---

## ⚙️ HALAMAN ADMIN

---

### PAGE 24 — AdminDashboardPage (`/admin`)
**File:** `src/pages/Admin/AdminDashboardPage.tsx`
**Features:** `F8_RoleAndPermission` + `F9_UserManagement` (stats)
**Layout:** `AppLayout` (ProtectedRoute — admin only)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/admin/stats/overview` | 🔒 Admin Only | Statistik harian: posts, users, reports |
| 2 | `GET` | `/api/admin/stats/points-summary` | 🔒 Admin Only | Agregat poin ekosistem |

#### TypeScript Interface (`features/Admin/F8_RoleAndPermission/types/index.ts`):
```typescript
// Response dari GET /api/admin/stats/overview
export interface AdminOverviewStats {
  total_users: number;
  total_posts: number;
  total_comments: number;
  pending_reports: number;
  new_users_today: number;
  new_posts_today: number;
  banned_users_count: number;
}

// Response dari GET /api/admin/stats/points-summary
export interface PointsSummary {
  total_points_distributed: number;
  top_earners: {
    user_id: string;
    username: string;
    total_points: number;
  }[];
  points_by_action: {
    action_type: string;
    total: number;
  }[];
}
```

---

### PAGE 25 — TagCategoryPage (`/admin/content`)
**File:** `src/pages/Admin/TagCategoryPage.tsx`
**Features:** `F10_CategoryMaster` + `F12_TagMaster`
**Layout:** `AppLayout` (ProtectedRoute — admin only)

#### API yang Dipanggil (via Admin prefix):
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/admin/categories` | 🔒 Admin | List kategori |
| 2 | `POST` | `/api/admin/categories` | 🔒 Admin | Buat kategori |
| 3 | `PUT` | `/api/admin/categories/{id}` | 🔒 Admin | Edit kategori |
| 4 | `DELETE` | `/api/admin/categories/{id}` | 🔒 Admin | Hapus kategori |
| 5 | `GET` | `/api/admin/tags` | 🔒 Admin | List tag |
| 6 | `POST` | `/api/admin/tags` | 🔒 Admin | Buat tag baru |
| 7 | `PUT` | `/api/admin/tags/{id}` | 🔒 Admin | Edit tag |
| 8 | `DELETE` | `/api/admin/tags/{id}` | 🔒 Admin | Hapus tag |

#### TypeScript Interface (`features/Admin/F10_CategoryMaster/types/index.ts`):
```typescript
// Payload buat/edit kategori — dari tabel categories
export interface CategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parent_id?: string | null;
}

// features/Admin/F12_TagMaster/types/index.ts
export interface TagPayload {
  name: string;
  slug: string;
  color: string; // Hex string e.g. "#D4AF37"
}
```

#### Komponen Utama:
- `features/Admin/F10_CategoryMaster/components/CategoryFormModal.tsx`
- `features/Admin/F12_TagMaster/components/TagFormModal.tsx`

---

### PAGE 26 — UserDirectoryPage (`/admin/users`)
**File:** `src/pages/Admin/UserDirectoryPage.tsx`
**Features:** `F9_UserManagement`
**Layout:** `AppLayout` (ProtectedRoute — admin only)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/admin/users` | 🔒 Admin | Seluruh daftar user |
| 2 | `GET` | `/api/admin/users/{id}` | 🔒 Admin | Detail satu user |
| 3 | `PUT` | `/api/admin/users/{id}/profile` | 🔒 Admin | Edit paksa profil user |
| 4 | `PUT` | `/api/admin/users/{id}/reset-password` | 🔒 Admin | Reset password user |

#### TypeScript Interface (`features/Admin/F9_UserManagement/types/index.ts`):
```typescript
// Full user data untuk admin directory
export interface AdminUserRow extends import('@/types').User {
  role: string;
  posts_count: number;
  is_banned: boolean;
  last_login_at?: string;
}

export interface AdminUpdateProfilePayload {
  username?: string;
  email?: string;
  bio?: string;
}

export interface AdminResetPasswordPayload {
  new_password: string;
  new_password_confirmation: string;
}
```

#### Komponen Utama:
- `features/Admin/F9_UserManagement/components/UserTable.tsx`

---

### PAGE 27 — RoleManagementPage (`/admin/roles`)
**File:** `src/pages/Admin/RoleManagementPage.tsx`
**Features:** `F8_RoleAndPermission`
**Layout:** `AppLayout` (ProtectedRoute — admin only)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/admin/roles` | 🔒 Admin | Daftar semua role |
| 2 | `POST` | `/api/admin/roles` | 🔒 Admin | Buat role baru |
| 3 | `PUT` | `/api/admin/roles/{id}` | 🔒 Admin | Edit permissions role |
| 4 | `DELETE` | `/api/admin/roles/{id}` | 🔒 Admin | Hapus role |
| 5 | `PUT` | `/api/admin/users/{id}/role` | 🔒 Admin | Assign role ke user |

#### TypeScript Interface:
```typescript
// Dari tabel roles — kolom permissions adalah JSON
export interface RoleItem {
  id: string;
  name: string;
  permissions: {
    can_ban: boolean;
    can_delete_post: boolean;
    can_resolve_report: boolean;
    can_manage_tags: boolean;
    can_manage_users: boolean;
    can_view_audit: boolean;
    [key: string]: boolean; // extensible
  };
}

export interface AssignRolePayload {
  role_id: string;
}
```

#### Komponen Utama:
- `features/Admin/F8_RoleAndPermission/components/RoleSelectDropdown.tsx`

---

### PAGE 28 — BadgeMasterPage (`/admin/badges`)
**File:** `src/pages/Admin/BadgeMasterPage.tsx`
**Features:** `F11_BadgeMaster`
**Layout:** `AppLayout` (ProtectedRoute — admin only)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/admin/badges` | 🔒 Admin | Semua badge master |
| 2 | `POST` | `/api/admin/badges` | 🔒 Admin | Buat badge baru |
| 3 | `PUT` | `/api/admin/badges/{id}` | 🔒 Admin | Edit badge |
| 4 | `DELETE` | `/api/admin/badges/{id}` | 🔒 Admin | Hapus badge |

#### TypeScript Interface (`features/Admin/F11_BadgeMaster/types/index.ts`):
```typescript
// Dari tabel badges
export interface BadgePayload {
  name: string;
  description: string;
  icon_url: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  condition_type: string;  // e.g. 'posts_count', 'reputation_points'
  condition_value: number; // minimal nilai kondisi tercapai
}
```

#### Komponen Utama:
- `features/Admin/F11_BadgeMaster/components/BadgeFormModal.tsx`

---

### PAGE 29 — AuditTimelinePage (`/admin/audit`)
**File:** `src/pages/Admin/AuditTimelinePage.tsx`
**Features:** `F14_ModeratorActionLog` (admin view)
**Layout:** `AppLayout` (ProtectedRoute — admin only)

#### API yang Dipanggil:
| # | Method | Endpoint | Guard | Deskripsi |
|---|--------|----------|-------|-----------|
| 1 | `GET` | `/api/admin/logs` | 🔒 Admin | Rekam jejak SEMUA aksi moderasi |
| 2 | `GET` | `/api/admin/posts/{post}/history` | 🔒 Admin | History edit post tertentu |
| 3 | `GET` | `/api/admin/comments/{comment}/history` | 🔒 Admin | History edit komentar tertentu |

---

## 🗺️ RINGKASAN PETA API → HALAMAN

| Endpoint | Digunakan di Halaman |
|----------|----------------------|
| `POST /auth/register` | RegisterPage |
| `POST /auth/login` | LoginPage |
| `POST /auth/logout` | Semua Layout (Navbar) |
| `GET /explore/search` | SearchPage |
| `GET /explore/trending` | HomePage (sidebar), TrendingPage |
| `GET /explore/tags` | TagsListPage, CreatePostPage (form) |
| `GET /explore/tag/{slug}` | TagFilterPage |
| `GET /explore/category/{slug}` | CategoryFilterPage |
| `GET /explore/leaderboard` | LeaderboardPage |
| `GET /posts` | HomePage (feed utama) |
| `GET /posts/{post}` | PostDetailPage, EditPostPage |
| `POST /posts` | CreatePostPage |
| `PUT /posts/{post}` | EditPostPage |
| `PATCH /posts/{post}/status` | MyPostsPage |
| `DELETE /posts/{post}` | MyPostsPage |
| `GET /me/posts` | MyPostsPage |
| `GET /posts/{post}/comments` | PostDetailPage |
| `POST /posts/{post}/comments` | PostDetailPage |
| `PUT /posts/{post}/comments/{comment}` | PostDetailPage |
| `POST /posts/{post}/comments/{comment}/replies` | PostDetailPage |
| `POST /posts/{post}/comments/{comment}/accept` | PostDetailPage |
| `POST /votes` | HomePage, PostDetailPage |
| `POST /likes/toggle` | HomePage, PostDetailPage |
| `GET /bookmarks` | BookmarksPage |
| `POST /bookmarks/toggle` | BookmarksPage, PostDetailPage |
| `GET /notifications` | NotificationsPage |
| `PATCH /notifications/{id}/read` | NotificationsPage |
| `PATCH /notifications/mark-all-read` | NotificationsPage |
| `GET /users/{id}/followers` | PublicProfilePage |
| `POST /users/{id}/follow` | PublicProfilePage |
| `GET /settings/profile` | ProfileSettingsPage |
| `PUT /settings/profile` | ProfileSettingsPage |
| `PUT /settings/password` | ProfileSettingsPage |
| `GET /me/badges` | MyBadgesPage |
| `POST /reports` | PostDetailPage, PublicProfilePage |
| `GET /moderator/reports` | ReportQueuePage |
| `PUT /moderator/reports/{id}` | ReportQueuePage |
| `GET /moderator/logs` | ActionLogPage |
| `GET /moderator/bans` | BanManagementPage |
| `POST /moderator/bans/{id}/warn` | BanManagementPage |
| `POST /moderator/bans/{id}/ban` | BanManagementPage |
| `POST /moderator/bans/{id}/unban` | BanManagementPage |
| `GET /moderator/posts/{post}/history` | PostEditHistoryPage, EditHistoryPage |
| `GET /moderator/comments/{comment}/history` | CommentEditHistoryPage, EditHistoryPage |
| `GET /admin/stats/overview` | AdminDashboardPage |
| `GET /admin/stats/points-summary` | AdminDashboardPage |
| `GET /admin/users` | UserDirectoryPage |
| `PUT /admin/users/{id}/role` | RoleManagementPage |
| `GET /admin/roles` | RoleManagementPage |
| `GET /admin/categories` | TagCategoryPage |
| `GET /admin/tags` | TagCategoryPage |
| `GET /admin/badges` | BadgeMasterPage |
| `GET /admin/logs` | AuditTimelinePage |

---

> **Catatan Implementasi:**
> - Semua API call HARUS ditulis di `features/[Domain]/[F]/api/index.ts`
> - Semua type definition HARUS ditulis di `features/[Domain]/[F]/types/index.ts`
> - Komponen di `features/` boleh import dari `types/` tapi **tidak boleh** import dari `pages/`
> - Gunakan **React Query** (`useQuery`, `useMutation`) untuk semua API call agar ada built-in caching dan loading state
