import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';

export default function UserLayout() {
  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] text-[#F0F0F0] flex font-['Inter']">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}