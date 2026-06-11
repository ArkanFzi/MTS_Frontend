  import React from 'react';
  import { NavLink, useNavigate } from 'react-router-dom';
  import {
    Home, TrendingUp, Tag, Trophy, LogIn, UserPlus, Search, Bell,
    BookMarked, PenSquare, User, Shield, Users, LayoutDashboard,
    Flag, ScrollText, Ban, Settings, Award, LogOut
  } from 'lucide-react';
  import { Button } from '../ui/button';
  import { useAuthStore } from '../../store/useAuthStore';

  export default function Sidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

  const role = user?.role ?? null;
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    const publicMenuItems = [
      { name: 'Home Feed', path: '/', icon: <Home className="h-4 w-4" /> },
      { name: 'Search Posts', path: '/search', icon: <Search className="h-4 w-4" /> },
      { name: 'Trending Posts', path: '/trending', icon: <TrendingUp className="h-4 w-4" /> },
      { name: 'Semua Tag', path: '/tags', icon: <Tag className="h-4 w-4" /> },
      { name: 'Papan Peringkat', path: '/leaderboard', icon: <Trophy className="h-4 w-4" /> },
    ];

    const userMenuItems = [
      { name: 'Notifications', path: '/notifications', icon: <Bell className="h-4 w-4" /> },
      { name: 'My Posts', path: '/me/posts', icon: <PenSquare className="h-4 w-4" /> },
      { name: 'My Badges', path: '/me/badges', icon: <Award className="h-4 w-4" /> },
      { name: 'Profile Settings', path: '/settings/profile', icon: <Settings className="h-4 w-4" /> },
    ];

    const moderatorMenuItems = [
      { name: 'Report Queue', path: '/moderator/reports', icon: <Flag className="h-4 w-4" /> },
      { name: 'Action Logs', path: '/moderator/logs', icon: <ScrollText className="h-4 w-4" /> },
      { name: 'Ban Management', path: '/moderator/bans', icon: <Ban className="h-4 w-4" /> },
      { name: 'Tag & Category', path: '/moderator/tag-category', icon: <Tag className="h-4 w-4" /> },
    ];

    const adminMenuItems = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { name: 'Users', path: '/admin/users', icon: <Users className="h-4 w-4" /> },
      { name: 'Roles', path: '/admin/roles', icon: <Shield className="h-4 w-4" /> },
      { name: 'Badges', path: '/admin/badges', icon: <Award className="h-4 w-4" /> },
      { name: 'Tag & Category', path: '/admin/tag-category', icon: <Tag className="h-4 w-4" /> },
    ];

    const renderMenuGroup = (label: string, items: typeof publicMenuItems) => (
      <nav className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">
          {label}
        </span>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#0B0B0C] text-[#D4AF37] border border-[#2A2A2C]'
                  : 'text-gray-400 hover:text-[#F0F0F0] hover:bg-[#0B0B0C]/50'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    );

    return (
      <aside className="w-[250px] max-w-[250px] min-w-[250px] h-full flex-shrink-0 bg-[#161618] border-r border-[#2A2A2C] flex flex-col justify-between p-5 sticky top-0 font-['Inter'] overflow-y-auto">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div
            className="text-xl font-bold text-[#D4AF37] cursor-pointer"
            onClick={() => navigate('/')}
          >
            Mau Tanya Suhu
          </div>

          {/* Public Menu */}
          {renderMenuGroup('Jelajah', publicMenuItems)}

          {/* User Menu */}
          {user && renderMenuGroup('Akun', userMenuItems)}

          {/* Moderator Menu */}
          {(role === 'moderator' || role === 'admin') && renderMenuGroup('Moderator', moderatorMenuItems)}

          {/* Admin Menu */}
          {role === 'admin' && renderMenuGroup('Admin', adminMenuItems)}
        </div>

        {/* Bottom Section */}
        <div className="mt-6">
          {user ? (
            <div className="bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg p-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#D4AF37]" />
                <span className="text-sm text-zinc-200 font-medium truncate">{user.username}</span>
              </div>
              <span className="text-xs text-zinc-500 capitalize">{role ?? 'user'}</span>
              <Button
                variant="outline"
                className="w-full border-[#2A2A2C] text-[#F0F0F0] hover:bg-red-900/30 hover:text-red-400 text-xs h-9 bg-transparent mt-1"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg p-4 flex flex-col gap-2.5">
              <p className="text-xs text-gray-400 text-center mb-1">
                Bergabunglah dengan komunitas para suhu!
              </p>
              <Button
                variant="outline"
                className="w-full border-[#2A2A2C] text-[#F0F0F0] hover:bg-[#161618] hover:text-white text-xs h-9 bg-transparent"
                onClick={() => navigate('/login')}
              >
                <LogIn className="mr-2 h-3.5 w-3.5" />
                Masuk
              </Button>
              <Button
                className="w-full bg-[#D4AF37] text-black hover:bg-[#c29f2f] text-xs font-bold tracking-tight h-9"
                onClick={() => navigate('/register')}
              >
                <UserPlus className="mr-2 h-3.5 w-3.5" />
                Daftar
              </Button>
            </div>
          )}
        </div>
      </aside>
    );
  }