<<<<<<< HEAD
import { Outlet, Navigate } from 'react-router-dom';

export default function PublicLayout() {
  // Contoh logika opsional: Kalau user ternyata sudah login, 
  // langsung tendang/redirect ke halaman dashboard utama
  const isAuthenticated = false; // ganti dengan logic auth aslimu nanti

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="public-layout min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Kamu bisa pasang komponen global untuk halaman publik di sini,
        misalnya: Navbar luar, semacam alert info, atau background pattern global.
      */}
      
      <main className="flex w-full items-center justify-center">
        {/* <Outlet /> adalah tempat LoginPage / RegisterPage kamu muncul */}
        <Outlet />
      </main>

      {/* Contoh footer global halaman auth */}
      <footer className="absolute bottom-4 w-full text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MTS-Frontend. All rights reserved.
      </footer>
=======
import { Outlet } from 'react-router-dom';
import GuestSidebar from '../components/Sidebar/GuestSidebar';


export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] text-[#FOFOFO] flex font-['Inter']">
      
      <GuestSidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>

>>>>>>> ee1f51ead7f09bd838620ec8220ee39cb6f956be
    </div>
  );
}