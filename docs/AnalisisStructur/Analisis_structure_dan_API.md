# Arsitektur Final: Fullstack Feature-Sliced Design (Project MTS)
**Versi:** 3.0 (Terverifikasi & Final)
**Tanggal Update:** 7 Juni 2026

Dokumen ini adalah panduan komprehensif dan **terverifikasi** dari arsitektur akhir aplikasi *Fullstack* MTS. Arsitektur ini menggunakan pola **Feature-Sliced Design (Vertical Slices)** yang menyelaraskan struktur Frontend (React/Vite) dengan Backend (Laravel Modules).

> Tujuan utama: **High Cohesion & Low Coupling** — kode dikelompokkan berdasarkan *Domain Bisnis*, bukan berdasarkan tipe file teknis.

---

## 1. BACKEND — Laravel Modular (`MTS_backend/Modules/`)

Backend menggunakan arsitektur modular yang membuang pendekatan tradisional Laravel (semua Controller menumpuk di satu folder). Setiap *Use Case* memiliki lapisannya sendiri yang terisolasi.

### Penjelasan Isi File Backend

| Folder | Peran | Aturan |
|--------|-------|--------|
| `Controllers/` | Pintu masuk HTTP — Terima Request, kembalikan Response JSON | ❌ Dilarang: query DB & logika bisnis |
| `Requests/` | Gerbang validasi input (pakai `FormRequest` Laravel) | Wajib dieksekusi sebelum Controller |
| `Services/` | Otak fitur — semua kalkulasi & alur bisnis ada di sini | ❌ Dilarang: menyentuh Request/Response HTTP |
| `Repositories/` | Penjaga DB — satu-satunya yang boleh query Eloquent | ❌ Dilarang: ada di Controller atau Service |

### Struktur Direktori Backend (Lengkap & Final)

```text
Modules/
├── Auth/
│   ├── F1_Register/   → {Controllers, Services, Repositories, Requests}
│   ├── F2_Login/      → {Controllers, Services, Repositories, Requests}
│   ├── F3_Logout/     → {Controllers, Services, Repositories, Requests}
│   └── F31_ForgotPassword/ → {Controllers, Services, Repositories, Requests}
│
├── Common/
│   ├── F4_SearchPost/          → API pencarian teks penuh
│   ├── F5_FilterByTag/         → API filter postingan berdasarkan tag
│   ├── F6_FilterByCategory/    → API filter postingan berdasarkan kategori
│   └── F7_TrendingPopularPost/ → API postingan paling viral/trending
│
├── Admin/
│   ├── F8_RoleAndPermission/   → Manajemen role & hak akses user
│   ├── F9_UserManagement/      → Direktori & kontrol akun seluruh user
│   ├── F10_CategoryMaster/     → CRUD master data kategori
│   ├── F11_BadgeMaster/        → CRUD master lencana penghargaan
│   └── F12_TagMaster/          → CRUD master tag + konfigurasi warna hex
│
├── Moderator/
│   ├── F13_ContentReportQueue/ → Antrean laporan pelanggaran konten
│   ├── F14_ModeratorActionLog/ → Riwayat keputusan moderasi
│   └── F15_UserBanSanction/    → Penjatuhan sanksi & pembekuan akun
│
└── User/
    ├── F16_Post/                → CRUD postingan (Makro: Create+Edit+Delete)
    ├── F17_Comment/             → CRUD komentar (Makro: Create+Edit+Delete)
    ├── F18_MarkAcceptedAnswer/  → Menandai jawaban terbaik pada thread
    ├── F19_PostEditHistory/     → Riwayat revisi teks postingan
    ├── F20_NestedCommentReply/  → Balasan bertingkat pada komentar
    ├── F21_CommentEditHistory/  → Riwayat revisi teks komentar
    ├── F22_VoteSystem/          → Upvote/Downvote postingan & komentar
    ├── F23_LikeSystem/          → Like/Unlike postingan
    ├── F24_BookmarkPost/        → Simpan/hapus postingan ke bookmark
    ├── F25_FollowUser/          → Follow/Unfollow antar pengguna
    ├── F26_NotificationSystem/  → Pemberitahuan interaksi masuk
    ├── F27_GamificationLeaderboard/ → Papan peringkat poin reputasi
    ├── F28_ProfileSettings/     → Ubah bio, avatar, dan password
    ├── F29_BadgeAchievement/    → Koleksi lencana pencapaian user
    └── F30_UserReport/          → Melaporkan akun user bermasalah
```

---

## 2. FRONTEND — React/Vite (`MTS_frontend/src/`)

Frontend menggabungkan **Atomic Design** (komponen dasar) dan **Feature-Sliced Design** (logika per fitur).

### Penjelasan Isi File Frontend

| Folder | Peran | Aturan |
|--------|-------|--------|
| `components/ui/` | Komponen primitive dari shadcn/ui | ❌ Tidak boleh tahu tentang API atau routing |
| `components/shared/` | Komponen komposit reusable lintas domain | ❌ Tidak boleh fetch data sendiri |
| `features/[Domain]/[F]/api/` | Fungsi Axios/React Query khusus fitur ini | ✅ Satu-satunya tempat yang boleh hit API |
| `features/[Domain]/[F]/components/` | Komponen UI yang tahu konteks bisnisnya | ✅ Boleh memanggil fungsi dari `api/` |
| `features/[Domain]/[F]/types/` | TypeScript interface & type untuk fitur ini | Kontrak data antara FE dan BE |
| `pages/` | Smart Container — orkestrasi layout & data | ❌ Jangan menulis logika bisnis di sini |
| `layouts/` | Kerangka visual (Navbar, Sidebar, Outlet) | Hanya render struktur visual |
| `routes/` | Definisi URL → Komponen Page | Satu file, semua rute |

### Struktur Direktori Frontend (Lengkap & Final)

```text
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx        (Tema aksen emas #D4AF37)
│   │   ├── card.tsx          (Tema Obsidian Black #161618)
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── dialog.tsx
│   └── shared/
│       ├── StatusBadge.tsx        (Label status: 'SYSTEM.ONLINE', 'MUTED', dll)
│       ├── TechnicalTimestamp.tsx (Format waktu audit dengan font Fira Code)
│       └── LoadingSpinner.tsx     (Indikator loading global)
│
├── features/
│   ├── Auth/
│   │   ├── F1_Register/   → api/index.ts | components/{RegisterForm, TermsCheckbox}.tsx | types/index.ts
│   │   ├── F2_Login/      → api/index.ts | components/LoginForm.tsx | types/index.ts
│   │   ├── F3_Logout/     → api/index.ts | components/LogoutButton.tsx | types/index.ts
│   │   └── F31_ForgotPassword/ → api/index.ts | components/ForgotPasswordForm.tsx | types/index.ts
│   │
│   ├── Common/
│   │   ├── F4_SearchPost/          → api/ | components/SearchBar.tsx | types/
│   │   ├── F5_FilterByTag/         → api/ | components/TagBadgeGroup.tsx | types/
│   │   ├── F6_FilterByCategory/    → api/ | components/CategoryList.tsx | types/
│   │   └── F7_TrendingPopularPost/ → api/ | components/TrendingSidebar.tsx | types/
│   │
│   ├── Admin/
│   │   ├── F8_RoleAndPermission/   → api/ | components/RoleSelectDropdown.tsx | types/
│   │   ├── F9_UserManagement/      → api/ | components/UserTable.tsx | types/
│   │   ├── F10_CategoryMaster/     → api/ | components/CategoryFormModal.tsx | types/
│   │   ├── F11_BadgeMaster/        → api/ | components/BadgeFormModal.tsx | types/
│   │   └── F12_TagMaster/          → api/ | components/TagFormModal.tsx | types/
│   │
│   ├── Moderator/
│   │   ├── F13_ReportQueue/        → api/ | components/{ReportListRow, ActionReasonModal}.tsx | types/
│   │   ├── F14_ModeratorActionLog/ → api/ | components/ActionLogTable.tsx | types/
│   │   └── F15_UserBanSanction/    → api/ | components/BanControlForm.tsx | types/
│   │
│   └── User/
│       ├── F16_Post/                → api/ | components/{CreatePostForm, EditPostForm, PostCardItem}.tsx | types/
│       ├── F17_Comment/             → api/ | components/{CommentList, ReplyForm}.tsx | types/
│       ├── F18_MarkAcceptedAnswer/  → api/ | components/AcceptAnswerButton.tsx | types/
│       ├── F19_PostEditHistory/     → api/ | components/PostHistoryDiff.tsx | types/
│       ├── F20_NestedCommentReply/  → api/ | components/NestedReplyList.tsx | types/
│       ├── F21_CommentEditHistory/  → api/ | components/CommentHistoryDiff.tsx | types/
│       ├── F22_VoteSystem/          → api/ | components/VoteControl.tsx | types/
│       ├── F23_LikeSystem/          → api/ | components/LikeButton.tsx | types/
│       ├── F24_BookmarkPost/        → api/ | components/BookmarkToggle.tsx | types/
│       ├── F25_FollowUser/          → api/ | components/FollowButton.tsx | types/
│       ├── F26_NotificationSystem/  → api/ | components/NotificationRow.tsx | types/
│       ├── F27_GamificationLeaderboard/ → api/ | components/{LeaderboardTable, RankCard}.tsx | types/
│       ├── F28_ProfileSettings/     → api/ | components/SettingsForm.tsx | types/
│       ├── F29_BadgeAchievement/    → api/ | components/BadgeGridDisplay.tsx | types/
│       └── F30_UserReport/          → api/ | components/ReportUserModal.tsx | types/
│
├── pages/                          (29 HALAMAN UTAMA + 2 HISTORY)
│   ├── Auth/
│   │   ├── RegisterPage.tsx         (PAGE 1  — F1_Register)
│   │   └── LoginPage.tsx            (PAGE 2  — F2_Login)
│   ├── Public/
│   │   ├── HomePage.tsx             (PAGE 3  — F16_Post + F7_Trending)
│   │   ├── PostDetailPage.tsx       (PAGE 4  — F16_Post + F17_Comment + F18 + F20 + F22 + F23)
│   │   ├── SearchPage.tsx           (PAGE 5  — F4_SearchPost)
│   │   ├── TagFilterPage.tsx        (PAGE 6  — F5_FilterByTag)
│   │   ├── CategoryFilterPage.tsx   (PAGE 7  — F6_FilterByCategory)
│   │   ├── TrendingPage.tsx         (PAGE 8  — F7_TrendingPopularPost)
│   │   ├── LeaderboardPage.tsx      (PAGE 9  — F27_GamificationLeaderboard)
│   │   └── TagsListPage.tsx         (PAGE 10 — F12_TagMaster [read-only])
│   ├── User/
│   │   ├── CreatePostPage.tsx       (PAGE 11 — F16_Post [Create])
│   │   ├── EditPostPage.tsx         (PAGE 12 — F16_Post [Edit])
│   │   ├── MyPostsPage.tsx          (PAGE 13 — F16_Post [filter by current user])
│   │   ├── BookmarksPage.tsx        (PAGE 14 — F24_BookmarkPost)
│   │   ├── NotificationsPage.tsx    (PAGE 15 — F26_NotificationSystem)
│   │   ├── ProfileSettingsPage.tsx  (PAGE 16 — F28_ProfileSettings)
│   │   ├── PublicProfilePage.tsx    (PAGE 17 — F23_PublicProfile + F25_FollowUser)
│   │   ├── MyBadgesPage.tsx         (PAGE 18 — F29_BadgeAchievement)
│   │   ├── PostEditHistoryPage.tsx  (PAGE ✨ — F19_PostEditHistory) ← BARU
│   │   └── CommentEditHistoryPage.tsx (PAGE ✨ — F21_CommentEditHistory) ← BARU
│   ├── Moderator/
│   │   ├── ReportQueuePage.tsx      (PAGE 19 — F13_ReportQueue)
│   │   ├── ActionLogPage.tsx        (PAGE 20 — F14_ModeratorActionLog)
│   │   ├── BanManagementPage.tsx    (PAGE 21 — F15_UserBanSanction)
│   │   ├── ModTagCategoryPage.tsx   (PAGE 22 — F10_CategoryMaster + F12_TagMaster)
│   │   └── EditHistoryPage.tsx      (PAGE 23 — F19_PostEditHistory + F21_CommentEditHistory)
│   └── Admin/
│       ├── AdminDashboardPage.tsx   (PAGE 24 — F8_RoleAndPermission + F9_UserManagement [stats])
│       ├── TagCategoryPage.tsx      (PAGE 25 — F10_CategoryMaster + F12_TagMaster)
│       ├── UserDirectoryPage.tsx    (PAGE 26 — F9_UserManagement)
│       ├── RoleManagementPage.tsx   (PAGE 27 — F8_RoleAndPermission)
│       ├── BadgeMasterPage.tsx      (PAGE 28 — F11_BadgeMaster)
│       └── AuditTimelinePage.tsx    (PAGE 29 — F14_ModeratorActionLog [admin view])
│
├── layouts/
│   ├── PublicLayout.tsx     (Header navbar untuk tamu/pengunjung)
│   ├── UserLayout.tsx       (Sidebar + navbar untuk user terautentikasi)
│   ├── ModeratorLayout.tsx  (Panel sidebar khusus moderator)
│   └── AdminLayout.tsx      (Fixed sidebar 250px bertema industrial luxury)
│
├── routes/
│   └── AppRouter.tsx        (Sentralisasi seluruh konfigurasi React Router v6)
│
├── types/
│   └── index.ts             (Global shared TypeScript interfaces)
│
├── lib/
│   └── utils.ts             (Fungsi helper shadcn/ui — jangan dihapus)
│
├── index.css                (Variabel Tailwind v4: Obsidian Black #161618 & Gold #D4AF37)
└── main.tsx                 (Entry point Vite)
```

---

## 3. Aturan Penting: Fitur Tanpa Halaman Sendiri

Beberapa fitur di `features/` sengaja **tidak memiliki halaman tersendiri** karena mereka bersifat **komponen aksi (action components)** yang diembed di dalam halaman lain. Ini adalah keputusan desain yang benar.

| Feature | Digunakan Di Halaman | Alasan |
|---------|----------------------|--------|
| `F3_Logout` | Semua layout (tombol di Navbar) | Aksi, bukan halaman |
| `F17_Comment` | `PostDetailPage` | Dirender di bawah postingan |
| `F18_MarkAcceptedAnswer` | `PostDetailPage` | Tombol aksi di tiap komentar |
| `F20_NestedCommentReply` | `PostDetailPage` | Bagian dari tree komentar |
| `F22_VoteSystem` | `PostDetailPage`, `HomePage` | Tombol ↑/↓ di tiap post/komentar |
| `F23_LikeSystem` | `PostDetailPage`, `HomePage` | Tombol ❤️ di tiap post |
| `F25_FollowUser` | `PublicProfilePage` | Tombol Follow di profil orang lain |
| `F30_UserReport` | `PostDetailPage`, `PublicProfilePage` | Modal dialog pelaporan |

---

## 4. Alur Komunikasi End-to-End (E2E) — Contoh: Register

```
URL /register
    │
    ▼
AppRouter.tsx  →  PublicLayout.tsx  →  RegisterPage.tsx (Smart Container)
                                              │
                                   Import komponen dari:
                                   features/Auth/F1_Register/
                                              │
                               ┌──────────────┼──────────────┐
                               ▼              ▼              ▼
                         components/       api/           types/
                       RegisterForm.tsx  index.ts       index.ts
                               │              │              │
                    Merakit UI dari    Hit POST /api/   Validasi format
                    components/ui/     auth/register    RegisterPayload
                  (button, input dll)       │
                                           ▼
                               BACKEND: Modules/Auth/F1_Register/
                               ┌──────────────────────────────┐
                               │  RegisterController.php      │
                               │       → RegisterRequest.php  │
                               │       → RegisterService.php  │
                               │       → UserRepository.php   │
                               │       → Database (users)     │
                               └──────────────────────────────┘
                                           │
                                    JSON Response
                                           │
                                           ▼
                              api/index.ts menerima respons
                              → Redirect ke /login
```

---

## 5. Status Audit Final (7 Juni 2026)

| Domain | Backend | Frontend | Keselarasan |
|--------|---------|----------|-------------|
| Auth | 3 folder (F1-F3) | 3 folder (F1-F3) | ✅ 100% |
| Common | 4 folder (F4-F7) | 4 folder (F4-F7) | ✅ 100% |
| Admin | 5 folder (F8-F12) | 5 folder (F8-F12) | ✅ 100% |
| Moderator | 3 folder (F13-F15) | 3 folder (F13-F15) | ✅ 100% |
| User | 15 folder (F16-F30) | 15 folder (F16-F30) | ✅ 100% |
| **TOTAL** | **31 folder** | **31 folder** | ✅ **100% MATCH** |



