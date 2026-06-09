import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, TrendingUp, Tag, Trophy, Search,
  BookMarked, Bell, FileText, Award, Settings,
  LogOut, PenSquare, LogIn, UserPlus,
  Shield, ShieldAlert, Users, LayoutDashboard, Tags, BadgeCheck, ClipboardList,
} from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../../features/Auth/F3_Logout/api';
import { toast } from 'sonner';
import type { ReactNode } from 'react';

interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

// ─── Explore section (visible to everyone) ───
const exploreItems: NavItem[] = [
  { name: 'Home Feed', path: '/', icon: <Home className="h-4 w-4" /> },
  { name: 'Search Posts', path: '/search', icon: <Search className="h-4 w-4" /> },
  { name: 'Trending', path: '/trending', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'All Tags', path: '/tags', icon: <Tag className="h-4 w-4" /> },
  { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="h-4 w-4" /> },
];

// ─── Authenticated user section ───
const userItems: NavItem[] = [
  { name: 'Create Post', path: '/posts/create', icon: <PenSquare className="h-4 w-4" /> },
  { name: 'My Posts', path: '/me/posts', icon: <FileText className="h-4 w-4" /> },
  { name: 'Bookmarks', path: '/bookmarks', icon: <BookMarked className="h-4 w-4" /> },
  { name: 'Notifications', path: '/notifications', icon: <Bell className="h-4 w-4" /> },
  { name: 'My Badges', path: '/me/badges', icon: <Award className="h-4 w-4" /> },
  { name: 'Settings', path: '/settings/profile', icon: <Settings className="h-4 w-4" /> },
];

// ─── Moderator section ───
const moderatorItems: NavItem[] = [
  { name: 'Report Queue', path: '/moderator/reports', icon: <Shield className="h-4 w-4" /> },
  { name: 'Action Logs', path: '/moderator/logs', icon: <ClipboardList className="h-4 w-4" /> },
  { name: 'Ban Management', path: '/moderator/bans', icon: <ShieldAlert className="h-4 w-4" /> },
  { name: 'Tags & Categories', path: '/moderator/tag-category', icon: <Tags className="h-4 w-4" /> },
];

// ─── Admin section ───
const adminItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: 'User Directory', path: '/admin/users', icon: <Users className="h-4 w-4" /> },
  { name: 'Role Management', path: '/admin/roles', icon: <Shield className="h-4 w-4" /> },
  { name: 'Categories', path: '/admin/tag-category', icon: <Tags className="h-4 w-4" /> },
  { name: 'Badge Master', path: '/admin/badges', icon: <BadgeCheck className="h-4 w-4" /> },
  { name: 'Audit Logs', path: '/admin/audit-logs', icon: <ClipboardList className="h-4 w-4" /> },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-[#0B0B0C] text-[#D4AF37] border border-[#2A2A2C]'
      : 'text-gray-400 hover:text-[#F0F0F0] hover:bg-[#0B0B0C]/50'
  }`;

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <nav className="flex flex-col gap-2">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1">
        {label}
      </span>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={linkClass}
        >
          {item.icon}
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      toast.success('Logged out successfully.');
      navigate('/login');
    },
    onError: () => {
      logout();
      navigate('/login');
    },
  });

  // ─── Determine role-based sections ───
  const isModerator = user?.roles?.some((r) => r === 'moderator' || r === 'admin');
  const isAdmin = user?.roles?.some((r) => r === 'admin');

  return (
    <aside className="w-[250px] max-w-[250px] min-w-[250px] h-screen bg-[#161618] border-r border-[#2A2A2C] flex flex-col justify-between p-5 sticky top-0 overflow-y-auto font-['Inter']">
      {/* ─── Top section ─── */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div
          className="text-xl font-bold text-[#D4AF37] tracking-tight cursor-pointer"
          onClick={() => navigate('/')}
        >
          Mau Tanya Suhu
        </div>

        {/* User info (if logged in) */}
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-sm">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white truncate max-w-[150px]">
                {user.username}
              </span>
              <span className="text-[10px] text-gray-500">Lv.{user.level || 1}</span>
            </div>
          </div>
        )}

        {/* Explore (everyone) */}
        <NavGroup label="Explore" items={exploreItems} />

        {/* User menu (authenticated) */}
        {user && <NavGroup label="My Space" items={userItems} />}

        {/* Moderator menu */}
        {isModerator && <NavGroup label="Moderation" items={moderatorItems} />}

        {/* Admin menu */}
        {isAdmin && <NavGroup label="Administration" items={adminItems} />}
      </div>

      {/* ─── Bottom section ─── */}
      {user ? (
        <Button
          variant="outline"
          className="w-full border-red-900 text-red-400 hover:bg-red-950/30 hover:text-red-300 text-xs h-9 bg-transparent"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </Button>
      ) : (
        <div className="bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg p-4 flex flex-col gap-2.5">
          <p className="text-xs text-gray-400 text-center mb-1">
            Join the community!
          </p>
          <Button
            variant="outline"
            className="w-full border-[#2A2A2C] text-[#F0F0F0] hover:bg-[#161618] hover:text-white text-xs h-9 bg-transparent"
            onClick={() => navigate('/login')}
          >
            <LogIn className="mr-2 h-3.5 w-3.5" />
            Login
          </Button>
          <Button
            className="w-full bg-[#D4AF37] text-black hover:bg-[#c29f2f] text-xs font-bold tracking-tight h-9"
            onClick={() => navigate('/register')}
          >
            <UserPlus className="mr-2 h-3.5 w-3.5" />
            Register
          </Button>
        </div>
      )}
    </aside>
  );
}
