import { NavLink, useNavigate } from 'react-router-dom';
import { Home, TrendingUp, Tag, Trophy, LogIn, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';


export default function GuestSidebar() {
  const navigate = useNavigate();

  // Daftar menu sesuai grup 'Jelajah' pada spesifikasi dokumen [cite: 19]
  const menuItems = [
    { name: 'Home Feed', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Trending Posts', path: '/trending', icon: <TrendingUp className="h-4 w-4" /> },
    { name: 'Semua Tag', path: '/tags', icon: <Tag className="h-4 w-4" /> },
    { name: 'Papan Peringkat', path: '/leaderboard', icon: <Trophy className="h-4 w-4" /> },
  ];

  return (
    <aside className="w-[250px] max-w-[250px] min-w-[250px] h-screen bg-[#161618] border-r border-[#2A2A2C] flex flex-col justify-between p-5 sticky top-0 font-['Inter']">
      
      {/* Bagian Atas: Logo [cite: 18] */}
      <div className="flex flex-col gap-8">
        <div className="text-xl font-bold text-[#D4AF37] tracking-tight cursor-pointer" onClick={() => navigate('/')}>
          Mau Tanya Suhu [cite: 18]
        </div>

        {/* Grup Menu 'Jelajah' [cite: 19] */}
        <nav className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">
            Jelajah [cite: 19]
          </span>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0B0B0C] text-[#D4AF37] border border-[#2A2A2C]'
                    : 'text-gray-400 hover:text-[#FOFOFO] hover:bg-[#0B0B0C]/50'
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bagian Bawah: Footer Sidebar / CTA Card Container [cite: 20] */}
      <div className="bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg p-4 flex flex-col gap-2.5">
        <p className="text-xs text-gray-400 text-center mb-1">
          Bergabunglah dengan komunitas para suhu!
        </p>
        
        {/* Tombol Masuk (Outline Steel) [cite: 20] */}
        <Button
          variant="outline"
          className="w-full border-[#2A2A2C] text-[#FOFOFO] hover:bg-[#161618] hover:text-white text-xs h-9 bg-transparent"
          onClick={() => navigate('/login')}
        >
          <LogIn className="mr-2 h-3.5 w-3.5" />
          Masuk [cite: 20]
        </Button>

        {/* Tombol Daftar (Solid Burnished Gold, Teks Hitam Tebal) [cite: 20] */}
        <Button
          className="w-full bg-[#D4AF37] text-black hover:bg-[#c29f2f] text-xs font-bold tracking-tight h-9"
          onClick={() => navigate('/register')}
        >
          <UserPlus className="mr-2 h-3.5 w-3.5" />
          Daftar [cite: 20]
        </Button>
      </div>

    </aside>
  );
}