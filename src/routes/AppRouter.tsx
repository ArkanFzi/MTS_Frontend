// src/routes/AppRouter.tsx
import { Routes, Route } from 'react-router-dom';

// Import Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import ModeratorLayout from '../layouts/ModeratorLayout';
import AdminLayout from '../layouts/AdminLayout';

// Import Guards
import GuestRoute from "../guards/ProtectedRoute/GuestRoute";
import ProtectedRoute from "../guards/ProtectedRoute/ProtectedRoute";

// Import Pages (Public)
import HomePage from '../pages/Public/HomePage';
import PostDetailPage from '../pages/Public/PostDetailPage';
import SearchPage from '../pages/Public/SearchPage';
import TrendingPage from '../pages/Public/TrendingPage';
import TagsListPage from '../pages/Public/TagsListPage';
import TagFilterPage from '../pages/Public/TagFilterPage';
import CategoryFilterPage from '../pages/Public/CategoryFilterPage';
import LeaderboardPage from '../pages/Public/LeaderboardPage';

// Import Pages (Auth)
import RegisterPage from '../pages/Auth/RegisterPage';
import LoginPage from '../pages/Auth/LoginPage';

// Import Pages (User)
import PublicProfilePage from '../pages/User/PublicProfilePage';
import CreatePostPage from '../pages/User/CreatePostPage';
import EditPostPage from '../pages/User/EditPostPage';
import MyPostsPage from '../pages/User/MyPostsPage';
import BookmarksPage from '../pages/User/BookmarksPage';
import NotificationsPage from '../pages/User/NotificationsPage';
import ProfileSettingsPage from '../pages/User/ProfileSettingsPage';
import MyBadgesPage from '../pages/User/MyBadgesPage';
import PostEditHistoryPage from '../pages/User/PostEditHistoryPage';
import CommentEditHistoryPage from '../pages/User/CommentEditHistoryPage';

// Import Pages (Moderator)
import ReportQueuePage from '../pages/Moderator/ReportQueuePage';
import ActionLogPage from '../pages/Moderator/ActionLogPage';
import BanManagementPage from '../pages/Moderator/BanManagementPage';
import ModTagCategoryPage from '../pages/Moderator/ModTagCategoryPage';

// Import Pages (Admin)
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import TagCategoryPage from '../pages/Admin/TagCategoryPage';
import UserDirectoryPage from '../pages/Admin/UserDirectoryPage';
import RoleManagementPage from '../pages/Admin/RoleManagementPage';
import BadgeMasterPage from '../pages/Admin/BadgeMasterPage';
import AuditTimelinePage from '../pages/Admin/AuditTimelinePage';

export default function AppRouter() {
  return (
    <Routes>
      
      {/* ================= GUEST ONLY ROUTES ================= */}
      <Route element={<GuestRoute />}>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ================= PUBLIC / VISITOR ROUTES ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/tags" element={<TagsListPage />} />
        <Route path="/tags/:slug" element={<TagFilterPage />} />
        <Route path="/category/:slug?" element={<CategoryFilterPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile/:id" element={<PublicProfilePage />} />
      </Route>

      {/* ================= PROTECTED USER ROUTES ================= */}
      {/* 🟢 PERBAIKAN: Eksplisit mendefinisikan allowedRoles untuk 'user' agar akun baru lolos guard pembungkus */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'moderator', 'admin']} />}>
        <Route element={<UserLayout />}>
          <Route path="/posts/create" element={<CreatePostPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/me/posts" element={<MyPostsPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings/profile" element={<ProfileSettingsPage />} />
          <Route path="/me/badges" element={<MyBadgesPage />} />
          <Route path="/posts/:id/history" element={<PostEditHistoryPage />} />
          <Route path="/comments/:id/history" element={<CommentEditHistoryPage />} />
        </Route>
      </Route>

      {/* ================= PROTECTED MODERATOR ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['moderator', 'admin']} />}>
        <Route element={<ModeratorLayout />}>
          <Route path="/moderator/reports" element={<ReportQueuePage />} />
          <Route path="/moderator/logs" element={<ActionLogPage />} />
          <Route path="/moderator/bans" element={<BanManagementPage />} />
          <Route path="/moderator/tag-category" element={<ModTagCategoryPage />} />
        </Route>
      </Route>

      {/* ================= PROTECTED ADMIN ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/tag-category" element={<TagCategoryPage />} />
          <Route path="/admin/users" element={<UserDirectoryPage />} />
          <Route path="/admin/roles" element={<RoleManagementPage />} />
          <Route path="/admin/badges" element={<BadgeMasterPage />} />
          <Route path="/admin/audit-logs" element={<AuditTimelinePage />} />
        </Route>
      </Route>

      {/* Fallback 404 Halaman Tidak Ditemukan */}
      <Route path="*" element={<div className="text-white text-center py-20 font-mono">Halaman tidak ditemukan.</div>} />

    </Routes>
  );
}