import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/Sidebar/AppSidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] text-[#F0F0F0] flex font-['Inter']">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
