
---

## 6. DOKUMEN INTEGRASI API LENGKAP (Frontend ke Backend)

Dokumen ini memetakan secara detail setiap endpoint API dari Backend Laravel (`routes/api.php`) yang harus dipanggil (*fetch/axios*) oleh masing-masing modul fitur Frontend (`src/features`).

### 🔒 Autentikasi: Sanctum SPA Cookie-Based

Autentikasi menggunakan **Laravel Sanctum SPA cookie-based**, bukan Bearer Token.

- **Tidak ada** header `Authorization: Bearer` — sesi dikelola melalui **HttpOnly cookie** secara otomatis.
- Frontend Axios sudah dikonfigurasi dengan `withCredentials: true` (`src/lib/axios.ts`).
- Backend memanggil `$middleware->statefulApi()` untuk mengaktifkan middleware Sanctum stateful.
- **CSRF exemption** berlaku untuk route publik auth berikut (karena request berasal dari SPA cross-origin):
  - `api/auth/login`
  - `api/auth/register`
  - `api/auth/forgot-password`
  - `api/auth/reset-password`
- Untuk request yang **sudah login** (terautentikasi cookie), Sanctum secara otomatis menangani validasi CSRF melalui cookie `XSRF-TOKEN`.

---

### 🔐 1. Domain AUTH (`features/Auth`)

| Fitur | HTTP | Endpoint | Payload / Keterangan |
|-------|------|----------|----------------------|
| **F1_Register** | `POST` | `/api/auth/register` | `username`, `email`, `password`, `password_confirmation` — Registrasi akun baru *(Publik)* |
| **F2_Login** | `POST` | `/api/auth/login` | `email`, `password` — Mengembalikan sesi cookie HttpOnly *(Publik)* |
| **F3_Logout** | `POST` | `/api/auth/logout` | *(kosong)* — Menginvalidate sesi di server *(Wajib Login)* |
| **F31_ForgotPassword** | `POST` | `/api/auth/forgot-password` | `email` — Meminta link reset password via email *(Publik)* |
| **F31_ForgotPassword** | `POST` | `/api/auth/reset-password` | `email`, `token`, `password`, `password_confirmation` — Mengatur ulang password *(Publik)* |

---

### 🌐 2. Domain COMMON / EXPLORE (`features/Common`)

*Semua endpoint di bawah bersifat **Publik** (tidak memerlukan login).*

| Fitur | HTTP | Endpoint | Payload / Keterangan |
|-------|------|----------|----------------------|
| **F4_SearchPost** | `GET` | `/api/explore/search` | Query param `?q={keyword}` — Pencarian teks penuh pada judul/isi post |
| **F5_FilterByTag** | `GET` | `/api/explore/tag/{slug}` | URL slug (contoh: `/tag/laravel`) — Postingan dengan tag tertentu |
| **F6_FilterByCategory** | `GET` | `/api/explore/category/{slug}` | URL slug (contoh: `/category/php`) — Postingan di kategori tertentu |
| **F7_TrendingPopularPost** | `GET` | `/api/explore/trending` | Query param opsional `?limit=10` — Top postingan dengan view/vote tertinggi |
| *(Global)* | `GET` | `/api/explore/tags` | *(tanpa param)* — Mendapatkan daftar seluruh tag (untuk halaman All Tags) |
| **F27_GamificationLeaderboard** | `GET` | `/api/explore/leaderboard` | *(tanpa param)* — Peringkat pengguna berdasarkan reputasi poin tertinggi |

---

### 📝 3. Domain POST & COMMENT (Publik + Protected)

*Endpoint GET bersifat **Publik**, sedangkan CUD (Create/Update/Delete) **wajib login**.*

#### 3a. Publik (tanpa login)

| Fitur | HTTP | Endpoint | Payload / Keterangan |
|-------|------|----------|----------------------|
| **F16_Post** (Feed) | `GET` | `/api/posts` | Mengambil timeline/feed pertanyaan global |
| **F16_Post** (Detail) | `GET` | `/api/posts/{post}` | Mengambil data 1 pertanyaan spesifik |
| **F17_Comment** (List) | `GET` | `/api/comments` | Mengambil daftar komentar (endpoint publik, tanpa nested post) |

#### 3b. Wajib Login (`auth:sanctum`)

| Fitur | HTTP | Endpoint | Payload / Keterangan |
|-------|------|----------|----------------------|
| **F16_Post** (Create) | `POST` | `/api/posts` | `title`, `body`, `category_id`, `tags[]` |
| **F16_Post** (Edit) | `PUT` | `/api/posts/{post}` | `title`, `body`, `category_id`, `tags[]` |
| **F16_Post** (Status) | `PATCH` | `/api/posts/{post}/status` | Mengubah status draft/published |
| **F16_Post** (Delete) | `DELETE` | `/api/posts/{post}` | Menghapus postingan sendiri |
| **F16_Post** (My Posts) | `GET` | `/api/me/posts` | Arsip seluruh postingan yang pernah dibuat user login |
| **F17_Comment** (List per Post) | `GET` | `/api/posts/{post}/comments` | Ambil daftar komentar untuk suatu post |
| **F17_Comment** (Create) | `POST` | `/api/posts/{post}/comments` | `body` — Isi komentar |
| **F17_Comment** (Edit) | `PUT` | `/api/posts/{post}/comments/{comment}` | `body` — Revisi teks komentar |
| **F18_MarkAcceptedAnswer** | `POST` | `/api/posts/{post}/comments/{comment}/accept` | Tandai komentar sebagai jawaban terbaik (oleh TS) |
| **F20_NestedCommentReply** (Create) | `POST` | `/api/posts/{post}/comments/{comment}/replies` | `body` — Balasan untuk suatu komentar |
| **F20_NestedCommentReply** (Edit) | `PUT` | `/api/posts/{post}/comments/{comment}/replies/{reply}` | Edit balasan komentar |
| **TagManagement** | `POST` | `/api/tags` | `name`, `color` — Menambah tag baru oleh user login |

---

### 👤 4. Domain USER (`features/User`)

*Semua fitur di bawah **wajib login** (`auth:sanctum`).*

| Fitur | HTTP | Endpoint | Payload / Keterangan |
|-------|------|----------|----------------------|
| **F28_ProfileSettings** (Get) | `GET` | `/api/settings/profile` | Ambil data profil diri sendiri |
| **F28_ProfileSettings** (Bio) | `PUT` | `/api/settings/profile` | `username`, `bio`, `avatar_url` — Update profil |
| **F28_ProfileSettings** (Pass) | `PUT` | `/api/settings/password` | `current_password`, `new_password` — Ganti password |
| **F29_BadgeAchievement** | `GET` | `/api/me/badges` | Ambil koleksi medali/badge milik sendiri |
| **F22_VoteSystem** | `POST` | `/api/votes` | `votable_id`, `votable_type`, `value` (1 atau -1) |
| **F23_LikeSystem** | `POST` | `/api/likes/toggle` | `likeable_id`, `likeable_type` (Post/Comment) — Toggle like |
| **F24_BookmarkPost** (Toggle) | `POST` | `/api/bookmarks/toggle` | `post_id` — Simpan/Hapus dari bookmark |
| **F24_BookmarkPost** (List) | `GET` | `/api/bookmarks` | Ambil semua post yang di-bookmark user |
| **F25_FollowUser** (Toggle) | `POST` | `/api/users/{id}/follow` | Follow/Unfollow user lain |
| **F25_FollowUser** (Followers) | `GET` | `/api/users/{id}/followers` | Ambil daftar pengikut user |
| **F25_FollowUser** (Following) | `GET` | `/api/users/{id}/following` | Ambil daftar user yang diikuti |
| **F26_NotificationSystem** (List) | `GET` | `/api/notifications` | Ambil laci notifikasi masuk |
| **F26_NotificationSystem** (Mark All) | `PATCH` | `/api/notifications/mark-all-read` | Tandai seluruh notifikasi sebagai terbaca |
| **F26_NotificationSystem** (Mark One) | `PATCH` | `/api/notifications/{id}/read` | Tandai 1 notifikasi sebagai terbaca |
| **F30_UserReport** | `POST` | `/api/reports` | `reportable_id`, `reportable_type`, `reason`, `description` |

---

### 🛡️ 5. Domain MODERATOR (`features/Moderator`)

*Membutuhkan `role: moderator, admin` (middleware `role:moderator,admin`). Semua endpoint di bawah juga **wajib login**.*

#### 5a. CRUD Master Data (apiResource)

| Fitur | HTTP | Endpoint | Kegunaan |
|-------|------|----------|----------|
| **F10_CategoryMaster** | `GET, POST, PUT, DELETE` | `/api/moderator/categories` | CRUD Kategori Forum (apiResource penuh) |
| **F11_BadgeMaster** | `GET, POST, PUT, DELETE` | `/api/moderator/badges` | CRUD Lencana (apiResource, kecuali `show`) |
| **F12_TagMaster** | `GET, POST, PUT, DELETE` | `/api/moderator/tags` | CRUD Tag (apiResource, kecuali `show`) |

#### 5b. Moderasi Konten & Laporan

| Fitur | HTTP | Endpoint | Kegunaan |
|-------|------|----------|----------|
| **Moderation** | `DELETE` | `/api/moderator/posts/{post}/comments/{comment}` | Hapus paksa komentar pelanggaran |
| **F13_ContentReportQueue** (List) | `GET` | `/api/moderator/reports` | Lihat antrean laporan pelanggaran dari user |
| **F13_ContentReportQueue** (Detail) | `GET` | `/api/moderator/reports/{id}` | Lihat detail 1 laporan |
| **F13_ContentReportQueue** (Update) | `PUT` | `/api/moderator/reports/{id}` | Update status laporan (Resolved/Rejected) |
| **F14_ModeratorActionLog** | `GET` | `/api/moderator/logs` | Lihat rekam jejak keputusan semua moderator |

#### 5c. Riwayat & Sanksi User

| Fitur | HTTP | Endpoint | Kegunaan |
|-------|------|----------|----------|
| **F19_PostEditHistory** | `GET` | `/api/moderator/posts/{post}/history` | Riwayat suntingan postingan |
| **F21_CommentEditHistory** | `GET` | `/api/moderator/comments/{comment}/history` | Riwayat suntingan komentar |
| **F15_UserBanSanction** (List) | `GET` | `/api/moderator/bans` | Lihat daftar user yang sedang dibanned |
| **F15_UserBanSanction** (Warn) | `POST` | `/api/moderator/bans/{id}/warn` | Kirim peringatan ke user |
| **F15_UserBanSanction** (Ban) | `POST` | `/api/moderator/bans/{id}/ban` | Eksekusi hukuman ban ke user |
| **F15_UserBanSanction** (Unban) | `POST` | `/api/moderator/bans/{id}/unban` | Cabut hukuman ban dari user |

---

### ⚙️ 6. Domain ADMIN (`features/Admin`)

*Hanya bisa diakses jika memiliki `role: admin` (middleware `role:admin`). Semua endpoint di bawah juga **wajib login**.*

| Fitur | HTTP | Endpoint | Payload / Keterangan |
|-------|------|----------|----------------------|
| **Dashboard Stats** (Overview) | `GET` | `/api/admin/stats/overview` | Analytics harian (posts, registrations, dll.) |
| **Dashboard Stats** (Points) | `GET` | `/api/admin/stats/points-summary` | Perputaran agregat poin ekosistem (`points_log`) |
| **F8_RoleAndPermission** | `GET` | `/api/admin/roles` | Ambil daftar seluruh role yang tersedia |
| **F9_UserManagement** (List) | `GET` | `/api/admin/users` | Direktori seluruh tabel `users` |
| **F9_UserManagement** (Detail) | `GET` | `/api/admin/users/{id}` | Lihat detail 1 user |
| **F9_UserManagement** (Role) | `PUT` | `/api/admin/users/{id}/role` | Mengubah/assign role ke user |
| **F9_UserManagement** (Profile) | `PUT` | `/api/admin/users/{id}/profile` | Otoritas paksa ubah profil user lain |
| **F9_UserManagement** (Reset Pass) | `PUT` | `/api/admin/users/{id}/reset-password` | Otoritas paksa reset password user lain |

> **Catatan:** CRUD Category, Badge, dan Tag untuk admin diakses melalui endpoint `/api/moderator/*` (bukan `/api/admin/*`), karena admin juga memiliki akses ke seluruh route moderator.

---

### 📌 Catatan Tambahan

1. **Tidak ada endpoint `/api/admin/categories`, `/api/admin/badges`, atau `/api/admin/tags`.** Seluruh CRUD master data tersebut berada di bawah prefix `/api/moderator/`.
2. **Route `GET /api/admin/roles` hanya mendukung method GET** (bukan CRUD penuh). Manajemen role saat ini terbatas pada pengambilan daftar role.
3. **Endpoint `GET /api/comments` bersifat publik** dan terpisah dari `GET /api/posts/{post}/comments` yang juga bisa diakses di dalam grup protected.
4. **Leaderboard (`/api/explore/leaderboard`) bersifat publik**, bukan bagian dari fitur yang memerlukan login.
