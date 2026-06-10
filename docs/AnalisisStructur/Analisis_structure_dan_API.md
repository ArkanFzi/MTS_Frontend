# Arsitektur Final: Fullstack Feature-Sliced Design (Project MTS)
**Versi:** 4.0 (Terverifikasi dari Codebase Aktual)
**Tanggal Update:** 10 Juni 2026

Dokumen ini adalah panduan komprehensif dan **terverifikasi langsung dari kode** arsitektur akhir aplikasi *Fullstack* MTS. Arsitektur ini menggunakan pola **Feature-Sliced Design (Vertical Slices)** yang menyelaraskan struktur Frontend (React/Vite/TypeScript) dengan Backend (Laravel Modules).

> Tujuan utama: **High Cohesion & Low Coupling** — kode dikelompokkan berdasarkan *Domain Bisnis*, bukan berdasarkan tipe file teknis.

---

## 1. BACKEND — Laravel Modular (`MTS_backend/Modules/`)

Backend menggunakan arsitektur modular di mana setiap *Use Case* memiliki lapisan terisolasi sendiri. Autentikasi menggunakan **Sanctum SPA cookie auth** (bukan Bearer token), dengan primary key **UUID** dan database **PostgreSQL**.

### Penjelasan Isi File Backend

| Folder | Peran | Aturan |
|--------|-------|--------|
| `Controllers/` | Pintu masuk HTTP — Terima Request, kembalikan Response JSON | ❌ Dilarang: query DB & logika bisnis |
| `Requests/` | Gerbang validasi input (pakai `FormRequest` Laravel) | Wajib dieksekusi sebelum Controller |
| `Services/` | Otak fitur — semua kalkulasi & alur bisnis ada di sini | ❌ Dilarang: menyentuh Request/Response HTTP |
| `Repositories/` | Penjaga DB — satu-satunya yang boleh query Eloquent | ❌ Dilarang: ada di Controller atau Service |

> **Catatan:** Tidak semua modul memiliki 4 folder. F3_Logout hanya punya `{Controllers, Services}`. F31_ForgotPassword punya folder tambahan `{Jobs, Mail}` untuk antrean pengiriman email.

### Middleware Role Backend

| Middleware | Digunakan Di | Efek |
|---|---|---|
| `auth:sanctum` | Semua route terproteksi | Wajib login via Sanctum SPA cookie |
| `role:moderator,admin` | Prefix `/api/moderator/*` | Hanya moderator atau admin |
| `role:admin` | Prefix `/api/admin/*` | Hanya admin |

### Struktur Direktori Backend (Lengkap & Final)

```text
Modules/
├── Auth/
│   ├── F1_Register/            → {Controllers, Services, Repositories, Requests}
│   ├── F2_Login/               → {Controllers, Services, Repositories, Requests}
│   ├── F3_Logout/              → {Controllers, Services}
│   └── F31_ForgotPassword/     → {Controllers, Services, Repositories, Requests, Jobs, Mail}
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

## 2. FRONTEND — React/Vite/TypeScript (`MTS_frontend/src/`)

Frontend menggabungkan **Atomic Design** (komponen dasar shadcn/ui) dan **Feature-Sliced Design** (logika per fitur).

### Stack Teknologi (Terverifikasi dari `package.json`)

| Kategori | Library | Versi |
|---|---|---|
| Framework | React | 19.x |
| Build Tool | Vite | 8.x |
| Language | TypeScript | 6.x |
| Routing | react-router-dom | 7.x |
| State Management | Zustand | 5.x (persist di localStorage) |
| Data Fetching | @tanstack/react-query | 5.x (useMutation, useQuery — WAJIB) |
| Form Handling | Formik + Yup | semua form autentikasi |
| HTTP Client | Axios | `withCredentials: true` (Sanctum SPA cookie) |
| Styling | Tailwind CSS | 4.x + shadcn/ui 4.x |
| Icons | lucide-react | — |
| Notifications | sonner (toast) | — |
| Error Handling | react-error-boundary | global `ErrorFallback` |

### Tema Visual

| Properti | Nilai |
|---|---|
| Background utama | Obsidian Black `#0B0B0C` |
| Sidebar | `#161618` |
| Aksen | Gold `#D4AF37` |
| Border | `#2A2A2C` |
| Font | Inter (body), Fira Code (monospace/audit) |

### Arsitektur Layout: SATU Layout Unified

> ⚠️ **PENTING:** Tidak ada 4 layout terpisah. Hanya ada **1 AppLayout** dengan **AppSidebar adaptif** yang menyesuaikan menu berdasarkan role user.

```
AppLayout.tsx
├── AppSidebar.tsx  (sidebar 250px, role-adaptive)
│   ├── Explore section     → SEMUA pengunjung (5 menu)
│   ├── My Space section    → Hanya user terautentikasi (6 menu)
│   ├── Moderation section  → role: moderator ATAU admin (4 menu)
│   └── Administration section → role: admin saja (6 menu)
└── <Outlet /> (konten halaman)
```

**Konfigurasi Role Badge di Sidebar:**

| Role | Warna Badge |
|---|---|
| Admin | Merah (`bg-red-950/50 text-red-400`) |
| Moderator | Biru (`bg-blue-950/50 text-blue-400`) |
| Member | Abu-abu (`bg-[#1A1A1C] text-gray-400`) |

### Penjelasan Isi File Frontend

| Folder | Peran | Aturan |
|--------|-------|--------|
| `components/ui/` | Komponen primitive dari shadcn/ui | ❌ Tidak boleh tahu tentang API atau routing |
| `components/shared/` | Komponen komposit reusable lintas domain | ❌ Tidak boleh fetch data sendiri |
| `components/Sidebar/` | AppSidebar — navigasi adaptif berdasarkan role | Import dari `useAuthStore` |
| `components/ErrorFallback/` | Fallback UI global saat terjadi runtime error | Dipakai oleh `react-error-boundary` |
| `features/[Domain]/[F]/api/` | Fungsi Axios + React Query khusus fitur ini | ✅ Satu-satunya tempat yang boleh hit API |
| `features/[Domain]/[F]/components/` | Komponen UI yang tahu konteks bisnisnya | ✅ Boleh memanggil fungsi dari `api/` |
| `features/[Domain]/[F]/types/` | TypeScript interface & type untuk fitur ini | Kontrak data antara FE dan BE |
| `pages/` | Smart Container — orkestrasi layout & data | ❌ Jangan menulis logika bisnis di sini |
| `layouts/` | AppLayout.tsx — satu-satunya layout (Sidebar + Outlet) | Hanya render struktur visual |
| `routes/` | AppRouter.tsx — Definisi URL → Komponen Page | Satu file, semua rute |
| `guards/` | GuestRoute + ProtectedRoute (role-based access) | Fail-closed design |
| `store/` | Zustand store (useAuthStore) | `user_data` di localStorage |
| `lib/` | axios.ts (instance + interceptor) + utils.ts | `withCredentials: true` |

### Route Guards (Fail-Closed)

| Guard | Lokasi | Logika |
|---|---|---|
| **GuestRoute** | `guards/ProtectedRoute/GuestRoute.tsx` | User sudah login → redirect ke `/`. Digunakan untuk: `/login`, `/register`, `/forgot-password`, `/reset-password` |
| **ProtectedRoute** (tanpa allowedRoles) | `guards/ProtectedRoute/ProtectedRoute.tsx` | 1) No user → `/login` 2) Banned → `/banned` 3) Lolos → render anak |
| **ProtectedRoute** (dengan allowedRoles) | sama | 1) No user → `/login` 2) Banned → `/banned` 3) roles kosong → `/403` 4) Tidak ada role cocok → `/403` 5) Cocok → render |

### Global Interceptor (`lib/axios.ts`)

- Menangkap response **401 Unauthorized** secara global
- Otomatis memanggil `logout()` dari `useAuthStore`
- Redirect ke `/login` (skip jika sudah di halaman auth)
- Tidak perlu handle session expiry manual di setiap API call

### Struktur Direktori Frontend (Lengkap & Final)

```text
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx        (Tema aksen emas #D4AF37)
│   │   ├── card.tsx          (Tema Obsidian Black #161618)
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── checkbox.tsx
│   │   ├── label.tsx
│   │   ├── sonner.tsx        (Toast notification provider)
│   │   └── CardDemo.tsx
│   ├── shared/
│   │   ├── StatusBadge.tsx        (Label status)
│   │   ├── TechnicalTimestamp.tsx (Format waktu audit, font Fira Code)
│   │   ├── LoadingSpinner.tsx     (Indikator loading)
│   │   └── SearchResultCard.tsx   (Kartu hasil pencarian reusable)
│   ├── Sidebar/
│   │   └── AppSidebar.tsx    (Navigasi adaptif berdasarkan role)
│   └── ErrorFallback/
│       └── ErrorFallback.tsx (Fallback UI saat runtime error)
│
├── features/
│   ├── Auth/
│   │   ├── F1_Register/        → api/index.ts | components/{RegisterForm, TermsCheckbox}.tsx | types/index.ts
│   │   ├── F2_Login/           → api/index.ts | components/LoginForm.tsx | types/index.ts
│   │   ├── F3_Logout/          → api/index.ts | components/LogoutButton.tsx | types/index.ts
│   │   └── F31_ForgotPassword/ → api/index.ts | components/ForgotPassword.tsx | types/index.ts
│   │
│   ├── Common/
│   │   ├── F4_SearchPost/          → api/ | components/SearchBar.tsx | types/
│   │   ├── F5_FilterByTag/         → api/ | components/{TagHeader, TagPostCard}.tsx | types/
│   │   ├── F6_FilterByCategory/    → api/ | components/CategoryList.tsx | types/
│   │   └── F7_TrendingPopularPost/ → api/ | components/TrendingSidebar.tsx | types/
│   │
│   ├── Admin/
│   │   ├── F8_RoleAndPermission/   → api/ | components/{AnalyticsChart, SystemToggleCard}.tsx | types/
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
│       ├── F27_GamificationLeaderboard/ → api/ | components/LeaderboardTable.tsx | types/
│       ├── F28_ProfileSettings/     → api/ | components/SettingsForm.tsx | types/
│       ├── F29_BadgeAchievement/    → api/ | components/BadgeGridDisplay.tsx | types/
│       └── F30_UserReport/          → api/ | components/ReportUserModal.tsx | types/
│
├── pages/                          (34 FILE HALAMAN dalam 6 subdirektori)
│   ├── Auth/                       (Guest-only, tanpa sidebar — fullscreen)
│   │   ├── LoginPage.tsx           ← F2_Login
│   │   ├── RegisterPage.tsx        ← F1_Register
│   │   └── ForgotPasswordPage.tsx  ← F31_ForgotPassword (menangani /forgot-password DAN /reset-password)
│   │
│   ├── Errors/
│   │   ├── BannedPage.tsx          ← Standalone (tanpa sidebar), layar "Account Suspended" di /banned
│   │   └── ForbiddenPage.tsx       ← Di dalam AppLayout (sidebar terlihat), error 403 di /403
│   │
│   ├── Public/                     (Di dalam AppLayout, terlihat untuk SEMUA pengunjung)
│   │   ├── HomePage.tsx            ← F16_Post + F7_Trending
│   │   ├── PostDetailPage.tsx      ← F16_Post + F17 + F18 + F20 + F22 + F23
│   │   ├── SearchPage.tsx          ← F4_SearchPost
│   │   ├── TrendingPage.tsx        ← F7_TrendingPopularPost
│   │   ├── TagsListPage.tsx        ← F12_TagMaster [read-only]
│   │   ├── TagFilterPage.tsx       ← F5_FilterByTag
│   │   ├── CategoryFilterPage.tsx  ← F6_FilterByCategory
│   │   └── LeaderboardPage.tsx     ← F27_GamificationLeaderboard
│   │
│   ├── User/                       (Protected — perlu login + tidak banned)
│   │   ├── CreatePostPage.tsx      ← F16_Post [Create]
│   │   ├── EditPostPage.tsx        ← F16_Post [Edit]
│   │   ├── PostEditHistoryPage.tsx ← F19_PostEditHistory
│   │   ├── CommentEditHistoryPage.tsx ← F21_CommentEditHistory
│   │   ├── MyPostsPage.tsx         ← F16_Post [filter current user]
│   │   ├── MyBadgesPage.tsx        ← F29_BadgeAchievement
│   │   ├── BookmarksPage.tsx       ← F24_BookmarkPost
│   │   ├── NotificationsPage.tsx   ← F26_NotificationSystem
│   │   ├── ProfileSettingsPage.tsx ← F28_ProfileSettings
│   │   └── PublicProfilePage.tsx   ← F25_FollowUser (di-import dari User/ tapi route-nya public)
│   │
│   ├── Moderator/                  (Protected — allowedRoles: ['moderator','admin'])
│   │   ├── ReportQueuePage.tsx     ← F13_ReportQueue
│   │   ├── ActionLogPage.tsx       ← F14_ModeratorActionLog
│   │   ├── BanManagementPage.tsx   ← F15_UserBanSanction
│   │   ├── ModTagCategoryPage.tsx  ← F10_CategoryMaster + F12_TagMaster
│   │   └── EditHistoryPage.tsx     ← F19 + F21 (⚠️ file ada tapi BELUM terdaftar di router)
│   │
│   └── Admin/                      (Protected — allowedRoles: ['admin'])
│       ├── AdminDashboardPage.tsx  ← F8 + F9 [stats overview]
│       ├── UserDirectoryPage.tsx   ← F9_UserManagement
│       ├── RoleManagementPage.tsx  ← F8_RoleAndPermission
│       ├── TagCategoryPage.tsx     ← F10_CategoryMaster + F12_TagMaster
│       ├── BadgeMasterPage.tsx     ← F11_BadgeMaster
│       └── AuditTimelinePage.tsx   ← F14_ModeratorActionLog [admin view]
│
├── layouts/
│   └── AppLayout.tsx         (SATU-SATUNYA layout: AppSidebar + Outlet)
│
├── routes/
│   └── AppRouter.tsx         (Sentralisasi seluruh konfigurasi React Router)
│
├── guards/
│   └── ProtectedRoute/
│       ├── GuestRoute.tsx    (Redirect user yang sudah login ke /)
│       ├── ProtectedRoute.tsx(Fail-closed: auth check + banned check + role check)
│       └── type.ts           (TypeScript interfaces untuk guard props)
│
├── store/
│   └── useAuthStore.ts       (Zustand: user, login(), logout() — persist di localStorage)
│
├── types/
│   └── index.ts              (User, Category, Tag, PaginatedResponse<T>, BaseApiResponse<T>)
│
├── lib/
│   ├── axios.ts              (Instance Axios + interceptor 401 global)
│   └── utils.ts              (Helper shadcn/ui — cn() function)
│
├── index.css                 (Variabel Tailwind v4: Obsidian Black & Gold)
├── App.tsx                   (QueryClientProvider + BrowserRouter + ErrorBoundary + AppRouter)
└── main.tsx                  (Entry point Vite — createRoot)
```

### Peta Route Lengkap (dari `AppRouter.tsx`)

```text
GUEST-ONLY (GuestRoute, tanpa sidebar):
  /login              → LoginPage
  /register           → RegisterPage
  /forgot-password    → ForgotPasswordPage
  /reset-password     → ForgotPasswordPage (mode reset via query params)

STANDALONE (tanpa sidebar, tanpa guard):
  /banned             → BannedPage

APP LAYOUT (sidebar adaptif):
  Public (tanpa guard):
    /                    → HomePage
    /posts/:id           → PostDetailPage
    /search              → SearchPage
    /trending            → TrendingPage
    /tags                → TagsListPage
    /tags/:slug          → TagFilterPage
    /category/:slug      → CategoryFilterPage
    /leaderboard         → LeaderboardPage
    /profile/:id         → PublicProfilePage

  Protected (login + tidak banned):
    /posts/create        → CreatePostPage
    /posts/:id/edit      → EditPostPage
    /posts/:id/history   → PostEditHistoryPage
    /comments/:id/history→ CommentEditHistoryPage
    /me/posts            → MyPostsPage
    /me/badges           → MyBadgesPage
    /bookmarks           → BookmarksPage
    /notifications       → NotificationsPage
    /settings/profile    → ProfileSettingsPage

  Protected (moderator + admin):
    /moderator/reports      → ReportQueuePage
    /moderator/logs         → ActionLogPage
    /moderator/bans         → BanManagementPage
    /moderator/tag-category → ModTagCategoryPage

  Protected (admin only):
    /admin/dashboard     → AdminDashboardPage
    /admin/users         → UserDirectoryPage
    /admin/roles         → RoleManagementPage
    /admin/tag-category  → TagCategoryPage
    /admin/badges        → BadgeMasterPage
    /admin/audit-logs    → AuditTimelinePage

  Error (dalam layout, sidebar tetap terlihat):
    /403                 → ForbiddenPage

  404 Fallback (standalone):
    /*                   → Inline "404 Page not found"
```

---

## 3. Aturan Penting: Fitur Tanpa Halaman Sendiri

Beberapa fitur di `features/` sengaja **tidak memiliki halaman tersendiri** karena mereka bersifat **komponen aksi (action components)** yang diembed di dalam halaman lain. Ini adalah keputusan desain yang benar.

| Feature | Digunakan Di Halaman | Alasan |
|---------|----------------------|--------|
| `F3_Logout` | AppSidebar (tombol Logout) | Aksi, bukan halaman |
| `F17_Comment` | `PostDetailPage` | Dirender di bawah postingan |
| `F18_MarkAcceptedAnswer` | `PostDetailPage` | Tombol aksi di tiap komentar |
| `F20_NestedCommentReply` | `PostDetailPage` | Bagian dari tree komentar |
| `F22_VoteSystem` | `PostDetailPage`, `HomePage` | Tombol ↑/↓ di tiap post/komentar |
| `F23_LikeSystem` | `PostDetailPage`, `HomePage` | Tombol ❤️ di tiap post |
| `F25_FollowUser` | `PublicProfilePage` | Tombol Follow di profil orang lain |
| `F30_UserReport` | `PostDetailPage`, `PublicProfilePage` | Modal dialog pelaporan |
| `F31_ForgotPassword` | `ForgotPasswordPage` | Komponen form di-embed di halaman (bukan halaman sendiri) |

---

## 4. Alur Komunikasi End-to-End (E2E) — Contoh: Register

```
URL /register
    │
    ▼
AppRouter.tsx
    │
    ├─ GuestRoute (cek: user sudah login? → redirect ke /)
    │
    ▼
RegisterPage.tsx (Smart Container — fullscreen, tanpa sidebar)
    │
    Import komponen dari:
    features/Auth/F1_Register/
    │
    ├─── components/         ├─── api/              ├─── types/
    │    RegisterForm.tsx    │    index.ts           │    index.ts
    │    TermsCheckbox.tsx   │                       │
    │                        │                       │
    │    Merakit UI dari     │  useMutation({        │  Validasi format
    │    components/ui/      │    mutationFn:         │  RegisterPayload
    │    (button, input,     │      registerUser,    │  via Formik + Yup
    │     checkbox, label)   │    onSuccess:          │
    │                        │      login() →         │
    │                        │      navigate('/')     │
    │                        │  })                    │
    │                        │                        │
    │                        ▼                        │
    │               Axios POST /api/auth/register     │
    │               (withCredentials: true)            │
    │                        │                        │
    │                        ▼                        │
    │               BACKEND: Modules/Auth/F1_Register/
    │               ┌──────────────────────────────┐
    │               │  RegisterController.php      │
    │               │    → RegisterRequest.php     │
    │               │    → RegisterService.php     │
    │               │    → UserRepository.php      │
    │               │    → Database (users)        │
    │               └──────────────────────────────┘
    │                        │
    │                 JSON Response
    │                        │
    │                        ▼
    │               api/index.ts menerima respons
    │               → login(userData) ke Zustand store
    │               → navigate('/') ke Home
    │
    └─ Selesai ✅
```

---

## 5. Status Audit Final (10 Juni 2026)

### Keselarasan Backend ↔ Frontend (per Domain)

| Domain | Backend | Frontend | Keselarasan |
|--------|---------|----------|-------------|
| Auth | 4 folder (F1, F2, F3, F31) | 4 folder (F1, F2, F3, F31) | ✅ 100% |
| Common | 4 folder (F4-F7) | 4 folder (F4-F7) | ✅ 100% |
| Admin | 5 folder (F8-F12) | 5 folder (F8-F12) | ✅ 100% |
| Moderator | 3 folder (F13-F15) | 3 folder (F13-F15) | ✅ 100% |
| User | 15 folder (F16-F30) | 15 folder (F16-F30) | ✅ 100% |
| **TOTAL** | **31 folder** | **31 folder** | ✅ **100% MATCH** |

### Status Implementasi Halaman (34 file, 33 terdaftar di router)

| Halaman | Status | Keterangan |
|---------|--------|------------|
| **Auth** | | |
| LoginPage | ✅ Fully Implemented | Formik + Yup, useMutation |
| RegisterPage | ✅ Fully Implemented | Formik + Yup, useMutation |
| ForgotPasswordPage | ✅ Fully Implemented | Dual-mode: forgot + reset via query params |
| **Errors** | | |
| BannedPage | ✅ Fully Implemented | Standalone, tombol logout |
| ForbiddenPage | ✅ Fully Implemented | Dalam AppLayout, link kembali ke Home |
| **Public** | | |
| HomePage | ✅ Fully Implemented | Feed postingan dengan pagination |
| SearchPage | ✅ Fully Implemented | Pencarian dengan filter |
| TagFilterPage | ✅ Fully Implemented | Filter by tag slug |
| TagsListPage | ✅ Fully Implemented | Daftar semua tag |
| PostDetailPage | ⬜ Placeholder | 9 baris, render judul saja |
| TrendingPage | ⬜ Placeholder | 9 baris, render judul saja |
| CategoryFilterPage | ⬜ Placeholder | 9 baris, render judul saja |
| LeaderboardPage | ⬜ Placeholder | 9 baris, render judul saja |
| PublicProfilePage | ⬜ Placeholder | 9 baris, render judul saja |
| **User (Protected)** | | |
| NotificationsPage | ✅ Fully Implemented | Daftar notifikasi + mark read |
| CreatePostPage | ⬜ Placeholder | 9 baris |
| EditPostPage | ⬜ Placeholder | 9 baris |
| PostEditHistoryPage | ⬜ Placeholder | ~15 baris |
| CommentEditHistoryPage | ⬜ Placeholder | ~15 baris |
| MyPostsPage | ⬜ Placeholder | 9 baris |
| MyBadgesPage | ⬜ Placeholder | 9 baris |
| BookmarksPage | ⬜ Placeholder | 9 baris |
| ProfileSettingsPage | ⬜ Placeholder | ~15 baris |
| **Moderator (Protected: moderator, admin)** | | |
| ReportQueuePage | ⬜ Placeholder | 9 baris |
| ActionLogPage | ⬜ Placeholder | 9 baris |
| BanManagementPage | ⬜ Placeholder | 9 baris |
| ModTagCategoryPage | ⬜ Placeholder | ~15 baris |
| EditHistoryPage | ⚠️ Orphan | File ada tapi **tidak terdaftar** di AppRouter.tsx |
| **Admin (Protected: admin)** | | |
| AdminDashboardPage | ⬜ Placeholder | 9 baris |
| UserDirectoryPage | ⬜ Placeholder | 9 baris |
| RoleManagementPage | ⬜ Placeholder | ~15 baris |
| TagCategoryPage | ⬜ Placeholder | 9 baris |
| BadgeMasterPage | ⬜ Placeholder | 9 baris |
| AuditTimelinePage | ⬜ Placeholder | 9 baris |

**Ringkasan:** 9 halaman fully implemented, 24 placeholder, 1 orphan (tidak ter-route).
