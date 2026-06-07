import { Routes, Route } from 'react-router-dom';
// route halaman
import HomePage from '../pages/Public/HomePage';
import SearchPage from '../pages/Public/SearchPage';
import TrendingPage from '../pages/Public/TrendingPage';
import TagsListPage from '../pages/Public/TagsListPage';
import LeaderboardPage from '../pages/Public/LeaderboardPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import LoginPage from '../pages/Auth/LoginPage';

// ─── 1. TAMBAHKAN IMPORT HALAMAN FILTER TAG DI SINI ───
import TagFilterPage from '../pages/Public/TagFilterPage';

// layout
import PublicLayout from '../layouts/PublicLayout';

export default function AppRouter() {
  return (
    <Routes>
      
      {/* ─── Kelompok Rute Publik Bersama Sidebar (Nested Routing) ─── */}
      <Route element={<PublicLayout />}>
        {/* Komponen-komponen ini otomatis dirender di bagian <Outlet /> milik PublicLayout */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/tags" element={<TagsListPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        
        <Route path="/tags/:slug" element={<TagFilterPage />} />
        
      </Route>

      {/* ─── Kelompok Rute Autentikasi (Tanpa Sidebar Global) ─── */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

    </Routes>
  );
}