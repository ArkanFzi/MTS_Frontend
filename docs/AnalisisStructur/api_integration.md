
---

## 6. DOKUMEN INTEGRASI API LENGKAP (Frontend ke Backend)

Dokumen ini memetakan secara detail setiap endpoint API dari Backend Laravel (`routes/api.php`) yang harus dipanggil (*fetch/axios*) oleh masing-masing modul fitur Frontend (`src/features`).

Semua request (kecuali yang di blok Publik) **wajib menyertakan header otorisasi:**
`Authorization: Bearer <token>`

### 🔐 1. Domain AUTH (`features/Auth`)

| Fitur | HTTP | Endpoint URI | Payload / Body (JSON) | Keterangan |
|-------|------|--------------|-----------------------|------------|
| **F1_Register** | `POST` | `/api/auth/register` | `username`, `email`, `password`, `password_confirmation` | Registrasi akun baru (Publik) |
| **F2_Login** | `POST` | `/api/auth/login` | `email`, `password` | Mengembalikan Bearer Token (Publik) |
| **F3_Logout** | `POST` | `/api/auth/logout` | *(kosong)* | Menghapus token di server (Wajib Login) |

---

### 🌐 2. Domain COMMON / EXPLORE (`features/Common`)
*Domain ini bersifat Publik (bisa diakses tanpa login).*

| Fitur | HTTP | Endpoint URI | Params / Query | Keterangan |
|-------|------|--------------|----------------|------------|
| **F4_SearchPost** | `GET` | `/api/explore/search` | `?q={keyword}` | Pencarian teks penuh pada judul/isi |
| **F5_FilterByTag** | `GET` | `/api/explore/tag/{slug}` | URL slug (ex: `/tag/laravel`) | Mendapatkan postingan dengan tag tertentu |
| **F6_FilterByCategory** | `GET` | `/api/explore/category/{slug}` | URL slug (ex: `/category/php`) | Mendapatkan postingan di kategori tertentu |
| **F7_TrendingPopularPost**| `GET` | `/api/explore/trending` | *(opsional)* `?limit=10` | Top 10 postingan dengan view/vote tertinggi |
| *(Global)* | `GET` | `/api/explore/tags` | *(kosong)* | Mendapatkan daftar seluruh tag (Halaman All Tags) |

---

### 👤 3. Domain USER (`features/User`)
*Semua fitur di bawah wajib Auth (Bearer Token).*

| Fitur | HTTP | Endpoint URI | Payload / Keterangan |
|-------|------|--------------|----------------------|
| **F16_Post** (Feed Publik) | `GET` | `/api/posts` | Mengambil timeline pertanyaan global |
| **F16_Post** (Detail) | `GET` | `/api/posts/{post}` | Mengambil data 1 pertanyaan spesifik |
| **F16_Post** (Create) | `POST` | `/api/posts` | `title`, `body`, `category_id`, `tags[]` |
| **F16_Post** (Edit) | `PUT` | `/api/posts/{post}` | `title`, `body`, `category_id`, `tags[]` |
| **F16_Post** (Status) | `PATCH` | `/api/posts/{post}/status` | Mengubah status draft/published |
| **F16_Post** (Delete) | `DELETE`| `/api/posts/{post}` | Menghapus postingan sendiri |
| **F16_Post** (My Posts)| `GET` | `/api/me/posts` | Arsip seluruh pertanyaan yang pernah dibuat user |
| **F17_Comment** (List) | `GET` | `/api/posts/{post}/comments` | Ambil daftar komentar untuk suatu post |
| **F17_Comment** (Create)| `POST` | `/api/posts/{post}/comments` | `body` (Isi komentar) |
| **F17_Comment** (Edit) | `PUT` | `/api/posts/{post}/comments/{comment}` | `body` (Revisi teks komentar) |
| **F18_MarkAcceptedAnswer**| `POST` | `/api/posts/{post}/comments/{comment}/accept` | Tandai komentar sebagai jawaban terbaik (Oleh TS) |
| **F19_PostEditHistory** | `GET` | `/api/moderator/posts/{post}/history` | Riwayat editan postingan (Hak mod/admin) |
| **F20_NestedCommentReply**| `POST` | `/api/posts/{post}/comments/{comment}/replies`| `body` (Balasan untuk suatu komentar) |
| **F20_NestedCommentReply**| `PUT` | `/api/posts/{post}/comments/{comment}/replies/{reply}`| Edit balasan komentar |
| **F21_CommentEditHistory**| `GET` | `/api/moderator/comments/{comment}/history` | Riwayat editan komentar (Hak mod/admin) |
| **F22_VoteSystem** | `POST` | `/api/votes` | `votable_id`, `votable_type`, `value` (1 atau -1) |
| **F23_LikeSystem** | `POST` | `/api/likes/toggle` | `likeable_id`, `likeable_type` (Post/Comment) |
| **F24_BookmarkPost** (Toggle)| `POST` | `/api/bookmarks/toggle` | `post_id` (Simpan / Hapus dari bookmark) |
| **F24_BookmarkPost** (List) | `GET` | `/api/bookmarks` | Ambil semua post yang di-bookmark user |
| **F25_FollowUser** (Toggle)| `POST` | `/api/users/{id}/follow` | Follow / Unfollow user lain |
| **F25_FollowUser** (Stats)| `GET` | `/api/users/{id}/followers` (dan `/following`) | Ambil daftar pengikut user |
| **F26_NotificationSystem**| `GET` | `/api/notifications` | Ambil laci notifikasi masuk |
| **F26_NotificationSystem**| `PATCH` | `/api/notifications/{id}/read` (dan `/mark-all-read`)| Tandai notifikasi terbaca |
| **F27_GamificationLeaderboard**| `GET` | `/api/explore/leaderboard` | Peringkat suhu (Reputasi poin tertinggi) |
| **F28_ProfileSettings** (Get) | `GET` | `/api/settings/profile` | Ambil data profil diri sendiri |
| **F28_ProfileSettings** (Bio) | `PUT` | `/api/settings/profile` | `username`, `bio`, `avatar_url` |
| **F28_ProfileSettings** (Pass)| `PUT` | `/api/settings/password` | `current_password`, `new_password` |
| **F29_BadgeAchievement** | `GET` | `/api/me/badges` | Ambil koleksi medali milik sendiri |
| **F30_UserReport** | `POST` | `/api/reports` | `reportable_id`, `reportable_type`, `reason`, `description` |

---

### 🛡️ 4. Domain MODERATOR (`features/Moderator`)
*Membutuhkan `role: moderator, admin`*

| Fitur | HTTP | Endpoint URI | Kegunaan |
|-------|------|--------------|----------|
| **F13_ContentReportQueue**| `GET` | `/api/moderator/reports` (dan `/{id}`) | Lihat antrean laporan pelanggaran dari user |
| **F13_ContentReportQueue**| `PUT` | `/api/moderator/reports/{id}` | Update status laporan (Resolved/Rejected) |
| **F14_ModeratorActionLog**| `GET` | `/api/moderator/logs` | Lihat rekam jejak keputusan semua moderator |
| **F15_UserBanSanction** | `GET` | `/api/moderator/bans` | Lihat daftar user yang sedang dibanned |
| **F15_UserBanSanction** | `POST` | `/api/moderator/bans/{id}/ban` (dan `/unban`) | Eksekusi hukuman ban/unban ke user |

> *Moderator juga memiliki akses CRUD ke Categories, Badges, dan Tags layaknya Admin.*

---

### ⚙️ 5. Domain ADMIN (`features/Admin`)
*Hanya bisa diakses jika memiliki `role: admin`*

| Fitur | HTTP | Endpoint URI | Payload / Kegunaan |
|-------|------|--------------|--------------------|
| **Dashboard Stats** | `GET` | `/api/admin/stats/overview` | *Analytics* harian (posts & registrations) |
| **Dashboard Stats** | `GET` | `/api/admin/stats/points-summary` | Perputaran agregat poin ekosistem (`points_log`) |
| **F8_RoleAndPermission** | `GET, POST, PUT, DEL` | `/api/admin/roles` | Manajemen nama Role dan JSON permissions |
| **F9_UserManagement** | `GET` | `/api/admin/users` (dan `/{id}`) | Direktori seluruh tabel `users` |
| **F9_UserManagement** | `PUT` | `/api/admin/users/{id}/role` | Mengubah/assign jabatan (role) ke user |
| **F9_UserManagement** | `PUT` | `/api/admin/users/{id}/profile` | Otoritas paksa ubah profil orang (termasuk reset password) |
| **F10_CategoryMaster** | `GET, POST, PUT, DEL` | `/api/admin/categories` (atau via `/moderator/categories`) | CRUD Rumpun Kategori Forum |
| **F11_BadgeMaster** | `GET, POST, PUT, DEL` | `/api/admin/badges` | CRUD Master Reward Lencana |
| **F12_TagMaster** | `GET, POST, PUT, DEL` | `/api/admin/tags` | CRUD Master warna Tag dan slug |
| **Log/History Audit** | `GET` | `/api/admin/logs`, `/admin/posts/{p}/history` | Menggunakan URL yang sama seperti Moderator |
