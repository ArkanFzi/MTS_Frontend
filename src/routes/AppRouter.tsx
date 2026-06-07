import { Routes, Route } from 'react-router-dom';
//route halaman
import HomePage from '../pages/Public/HomePage';
import SearchPage from '../pages/Public/SearchPage';
import TrendingPage from '../pages/Public/TrendingPage';
import TagsListPage from '../pages/Public/TagsListPage';
import LeaderboardPage from '../pages/Public/LeaderboardPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import LoginPage from '../pages/Auth/LoginPage';

//layout
import PublicLayout from '../layouts/PublicLayout';



export default function AppRouter() {
  return (
    <Routes>
      
      {/* ─── Kelompok Rute Publik Bersama Sidebar (Nested Routing) ─── */}
      <Route element={<PublicLayout />}>
        {/* Komponen-komponen ini otomatis dirender di bagian <Outlet /> milik PublicLayout */}
        <Route path="/" element={<HomePage />} /> [cite: 87]
        <Route path="/search" element={<SearchPage />} /> [cite: 112]
        <Route path="/trending" element={<TrendingPage />} /> [cite: 136]
        <Route path="/tags" element={<TagsListPage />} /> [cite: 154]
        <Route path="/leaderboard" element={<LeaderboardPage />} /> [cite: 145]
        
      </Route>

      {/* ─── Kelompok Rute Autentikasi (Tanpa Sidebar Global) ─── */}
      <Route path="/register" element={<RegisterPage />} /> [cite: 60]
      <Route path="/login" element={<LoginPage />} /> [cite: 75]

    </Routes>
  );
}