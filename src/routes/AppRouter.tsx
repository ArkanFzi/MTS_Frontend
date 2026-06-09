import { Routes, Route } from 'react-router-dom';

// ─── Layouts ───
import AppLayout from '../layouts/AppLayout';

// ─── Guards ───
import GuestRoute from '../guards/ProtectedRoute/GuestRoute';
import ProtectedRoute from '../guards/ProtectedRoute/ProtectedRoute';

// ─── Auth Pages (Guest-only, no sidebar) ───
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';

// ─── Public / Shared Pages ───
import HomePage from '../pages/Public/HomePage';
import PostDetailPage from '../pages/Public/PostDetailPage';
import SearchPage from '../pages/Public/SearchPage';
import TrendingPage from '../pages/Public/TrendingPage';
import TagsListPage from '../pages/Public/TagsListPage';
import TagFilterPage from '../pages/Public/TagFilterPage';
import CategoryFilterPage from '../pages/Public/CategoryFilterPage';
import LeaderboardPage from '../pages/Public/LeaderboardPage';
import PublicProfilePage from '../pages/User/PublicProfilePage';

// ─── User Pages (Authenticated) ───
import CreatePostPage from '../pages/User/CreatePostPage';
import EditPostPage from '../pages/User/EditPostPage';
import MyPostsPage from '../pages/User/MyPostsPage';
import BookmarksPage from '../pages/User/BookmarksPage';
import NotificationsPage from '../pages/User/NotificationsPage';
import ProfileSettingsPage from '../pages/User/ProfileSettingsPage';
import MyBadgesPage from '../pages/User/MyBadgesPage';
import PostEditHistoryPage from '../pages/User/PostEditHistoryPage';
import CommentEditHistoryPage from '../pages/User/CommentEditHistoryPage';

// ─── Moderator Pages ───
import ReportQueuePage from '../pages/Moderator/ReportQueuePage';
import ActionLogPage from '../pages/Moderator/ActionLogPage';
import BanManagementPage from '../pages/Moderator/BanManagementPage';
import ModTagCategoryPage from '../pages/Moderator/ModTagCategoryPage';

// ─── Admin Pages ───
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import TagCategoryPage from '../pages/Admin/TagCategoryPage';
import UserDirectoryPage from '../pages/Admin/UserDirectoryPage';
import RoleManagementPage from '../pages/Admin/RoleManagementPage';
import BadgeMasterPage from '../pages/Admin/BadgeMasterPage';
import AuditTimelinePage from '../pages/Admin/AuditTimelinePage';

export default function AppRouter() {
  return (
    <Routes>

      {/* ═══════════════ GUEST-ONLY (no sidebar) ═══════════════ */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Forgot password is accessible to guests only but not wrapped in GuestRoute
          so users who are logged in can still visit (edge case) */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ForgotPasswordPage />} />

      {/* ═══════════════ ALL PAGES (unified sidebar for everyone) ═══════════════ */}
      <Route element={<AppLayout />}>

        {/* ── Public routes (visible to all) ── */}
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/tags" element={<TagsListPage />} />
        <Route path="/tags/:slug" element={<TagFilterPage />} />
        <Route path="/category/:slug" element={<CategoryFilterPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/profile/:id" element={<PublicProfilePage />} />

        {/* ── Protected: Authenticated User ── */}
        <Route element={<ProtectedRoute />}>
          <Route path="/posts/create" element={<CreatePostPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/posts/:id/history" element={<PostEditHistoryPage />} />
          <Route path="/comments/:id/history" element={<CommentEditHistoryPage />} />
          <Route path="/me/posts" element={<MyPostsPage />} />
          <Route path="/me/badges" element={<MyBadgesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings/profile" element={<ProfileSettingsPage />} />
        </Route>

        {/* ── Protected: Moderator + Admin ── */}
        <Route element={<ProtectedRoute allowedRoles={['moderator', 'admin']} />}>
          <Route path="/moderator/reports" element={<ReportQueuePage />} />
          <Route path="/moderator/logs" element={<ActionLogPage />} />
          <Route path="/moderator/bans" element={<BanManagementPage />} />
          <Route path="/moderator/tag-category" element={<ModTagCategoryPage />} />
        </Route>

        {/* ── Protected: Admin only ── */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserDirectoryPage />} />
          <Route path="/admin/roles" element={<RoleManagementPage />} />
          <Route path="/admin/tag-category" element={<TagCategoryPage />} />
          <Route path="/admin/badges" element={<BadgeMasterPage />} />
          <Route path="/admin/audit-logs" element={<AuditTimelinePage />} />
        </Route>

      </Route>

      {/* ═══════════════ 404 Fallback ═══════════════ */}
      <Route path="*" element={
        <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center text-white font-['Inter']">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#D4AF37] mb-2">404</h1>
            <p className="text-gray-400">Page not found.</p>
          </div>
        </div>
      } />

    </Routes>
  );
}
