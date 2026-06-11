// ─── src/layouts/UserLayout.tsx ───
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// Catatan: Jika tidak menggunakan react-router-dom, Anda bisa mengganti <Link> dengan <a> biasa
import { UserIcon, SettingsIcon, LogOutIcon, HomeIcon } from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Tambahkan logika hapus token / mutasi logout di sini
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#121214] text-white font-sans">
      {/* 1. SIDEBAR (Navigasi Kiri) */}
      <aside className="w-64 bg-[#161618] border-r border-zinc-800 flex flex-col justify-between p-6 fixed h-full">
        <div className="space-y-8">
          {/* Logo / Nama Aplikasi */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wider text-[#D4AF37]">
              MTS FORUM
            </span>
          </div>

          {/* Menu Navigasi */}
          <nav className="space-y-2">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile</span>
            </Link>

            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 transition-colors"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Tombol Logout di bagian bawah Sidebar */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-colors text-left cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </aside>

      {/* 2. AREA KONTEN UTAMA (Sisi Kanan) */}
      {/* Di beri ml-64 karena sidebar di atas menggunakan posisi fixed */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* HEADER / NAVBAR ATAS */}
        <header className="h-16 border-b border-zinc-800 bg-[#161618]/50 backdrop-blur flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="text-sm text-zinc-400">
            {title ? `Pages / ${title}` : "User Panel"}
          </div>

          <div className="flex items-center space-x-4">
            {/* Indikator singkat user aktif */}
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
        </header>

        {/* CONTAINER UTAMA UNTUK CHILDREN */}
        {/* Di sinilah isi dari ProfileSettingsPage Anda akan dirender */}
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
