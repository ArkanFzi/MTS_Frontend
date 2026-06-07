import { Outlet } from 'react-router-dom';
import GuestSidebar from '../components/Sidebar/GuestSidebar';


export default function PublicLayout() {
  return (
    <div className="min-h-screen w-full bg-[#0B0B0C] text-[#FOFOFO] flex font-['Inter']">
      
      <GuestSidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}