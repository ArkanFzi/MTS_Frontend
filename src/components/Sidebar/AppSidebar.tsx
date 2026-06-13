import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Tag,
  Trophy,
  Search,
  BookMarked,
  Bell,
  FileText,
  Award,
  Settings,
  LogOut,
  PenSquare,
  LogIn,
  UserPlus,
  Shield,
  ShieldAlert,
  Users,
  LayoutDashboard,
  Tags,
  BadgeCheck,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/useAuthStore";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../features/Auth/F3_Logout/api";
import { toast } from "sonner";
import type { ReactNode } from "react";



interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
}

const exploreItems: NavItem[] = [
  {
    name: "Home Feed",
    path: "/",
    icon: <Home className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Search Posts",
    path: "/search",
    icon: <Search className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Trending",
    path: "/trending",
    icon: <TrendingUp className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "All Tags",
    path: "/tags",
    icon: <Tag className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Leaderboard",
    path: "/leaderboard",
    icon: <Trophy className="h-4 w-4 flex-shrink-0" />,
  },
];

const userItems: NavItem[] = [
  {
    name: "Create Post",
    path: "/posts/create",
    icon: <PenSquare className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "My Posts",
    path: "/me/posts",
    icon: <FileText className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Bookmarks",
    path: "/bookmarks",
    icon: <BookMarked className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: <Bell className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "My Badges",
    path: "/me/badges",
    icon: <Award className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Settings",
    path: "/settings/profile",
    icon: <Settings className="h-4 w-4 flex-shrink-0" />,
  },
];

const moderatorItems: NavItem[] = [
  {
    name: "Report Queue",
    path: "/moderator/reports",
    icon: <Shield className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Action Logs",
    path: "/moderator/logs",
    icon: <ClipboardList className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Ban Management",
    path: "/moderator/bans",
    icon: <ShieldAlert className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Tags & Categories",
    path: "/moderator/tag-category",
    icon: <Tags className="h-4 w-4 flex-shrink-0" />,
  },
];

const adminItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "User Directory",
    path: "/admin/users",
    icon: <Users className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Role Management",
    path: "/admin/roles",
    icon: <Shield className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Categories",
    path: "/admin/tag-category",
    icon: <Tags className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Badge Master",
    path: "/admin/badges",
    icon: <BadgeCheck className="h-4 w-4 flex-shrink-0" />,
  },
  {
    name: "Audit Logs",
    path: "/admin/audit-logs",
    icon: <ClipboardList className="h-4 w-4 flex-shrink-0" />,
  },
];

function NavGroup({
  label,
  items,
  isExpanded,
  onNavigate,
  groupIndex,
}: {
  label: string;
  items: NavItem[];
  isExpanded: boolean;
  onNavigate: () => void;
  groupIndex: number;
}) {
  return (
    <nav className="flex flex-col gap-1.5">
      {/* Label section - Selalu muncul di desktop, transisi cuma di mobile */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:max-h-10 lg:opacity-100 lg:mb-1 ${
          isExpanded ? "max-h-10 opacity-100 mb-1" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider px-2 truncate block">
          {label}
        </span>
      </div>

      {items.map((item, index) => {
        const globalIndex = groupIndex * 6 + index;
        const delayStyle = {
          transitionDelay: isExpanded ? `${globalIndex * 35}ms` : "0ms",
        };

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-300 lg:justify-start lg:gap-3 lg:w-full ${
                isExpanded 
                  ? "justify-start gap-3 w-full" 
                  : "justify-center"
              } ${
                isActive
                  ? "bg-[#0B0B0C] text-[#D4AF37] border border-[#2A2A2C]"
                  : "text-gray-400 hover:text-[#F0F0F0] hover:bg-[#0B0B0C]/50"
              }`
            }
          >
            {item.icon}

            {/* Teks menu utama - Di desktop selalu muncul utuh, di mobile pakai slide-in/out */}
            <div
              style={delayStyle}
              className={`overflow-hidden transition-all duration-500 ease-in-out flex-1 lg:max-w-full lg:opacity-100 lg:translate-x-0 lg:visible ${
                isExpanded
                  ? "max-w-full opacity-100 translate-x-0 visible"
                  : "max-w-0 opacity-0 -translate-x-4 invisible"
              }`}
            >
              <span className="truncate text-xs block whitespace-nowrap ml-3">
                {item.name}
              </span>
            </div>

            {/* Tooltip melayang - HANYA aktif di HP saat sidebar ditutup, desktop tidak butuh */}
            {!isExpanded && (
              <div className="absolute left-full ml-4 hidden max-lg:group-hover:flex items-center z-[9999] pointer-events-none top-1/2 -translate-y-1/2 drop-shadow-2xl">
                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#111112]"></div>
                <div className="bg-[#111112] text-zinc-200 text-[11px] font-normal px-3 py-1.5 rounded border border-[#2A2A2C] whitespace-nowrap">
                  {item.name}
                </div>
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function AppSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all cached queries to prevent stale data leaking to next user session
      queryClient.clear();
      logout();
      toast.success("Logged out successfully.");
      navigate("/login");
    },
    onError: () => {
      queryClient.clear();
      logout();
      navigate("/login");
    },
  });

  const isModerator = user?.roles?.some(
    (r) => r === "moderator" || r === "admin",
  );
  const isAdmin = user?.roles?.some((r) => r === "admin");

  const roleBadge = isAdmin
    ? { label: "Admin", color: "bg-red-950/50 text-red-400 border-red-900" }
    : isModerator
      ? { label: "Mod", color: "bg-blue-950/50 text-blue-400 border-blue-900" }
      : user
        ? {
            label: "User",
            color: "bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]",
          }
        : null;

  return (
    <>
      {/* ─── OVERLAY BACKDROP GAK AKAN MUNCUL DI DESKTOP (`max-lg:`) ─── */}
      <div
        onClick={() => setIsExpanded(false)}
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ease-in-out lg:hidden ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* CONTAINER STRUKTUR UTAMA (Mengunci lebar di desktop tetap 250px) */}
      <div className="w-[68px] min-w-[68px] lg:w-[250px] lg:min-w-[250px] h-screen sticky top-0 bg-transparent flex-shrink-0 z-50">
        
<aside
  className={`h-screen bg-[#161618] border-r border-[#2A2A2C] flex flex-col p-4 font-['Inter'] transition-all duration-300 ease-in-out lg:fixed lg:left-0 lg:top-0 lg:w-[250px] ${
    isExpanded
      ? "fixed left-0 top-0 w-[250px] z-50 shadow-2xl shadow-black/80"
      : "absolute left-0 top-0 w-[68px] max-lg:w-[68px]"
  }`}
>
  {/* ─── 1. HEADER (KUNCI DI ATAS, GAK IKUT SCROLL) ─── */}
  <div
    onClick={() => {
      if (window.innerWidth < 1024) setIsExpanded(!isExpanded);
    }}
    className={`flex items-center h-10 px-1 mb-4 select-none flex-shrink-0 lg:justify-between ${isExpanded ? "justify-between" : "justify-center"}`}
  >
      <div className={`w-full items-center justify-between lg:flex ${isExpanded ? "flex" : "hidden"}`}>
        <div className="text-xl font-bold text-[#D4AF37] tracking-tight truncate animate-in fade-in duration-300">
          <span>Mau Tanya Suhu</span>
        </div>
        <X className="h-4 w-4 text-gray-400 hover:text-white lg:hidden cursor-pointer" />
      </div>

    <div className={`p-1.5 rounded text-gray-400 hover:text-white hover:bg-[#2A2A2C] transition-colors lg:hidden ${!isExpanded ? "block" : "hidden"}`}>
      <Menu className="h-5 w-5 text-[#D4AF37]" />
    </div>
  </div>

  {/* ─── 2. USER INFO (KUNCI DI ATAS, GAK IKUT SCROLL) ─── */}
  {user && (
    <div
      className={`flex items-center py-1.5 mb-6 rounded-lg bg-[#0B0B0C]/40 border border-[#2A2A2C]/40 w-full flex-shrink-0 transition-all duration-300 lg:px-2 lg:gap-3 lg:justify-start ${
        isExpanded ? "px-2 gap-3 justify-start" : "justify-center"
      }`}
    >
      <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
        {user.username?.charAt(0).toUpperCase() || "U"}
      </div>

      <div
        className={`items-center justify-between flex-1 min-w-0 lg:flex lg:max-w-full lg:opacity-100 lg:visible lg:ml-1 ${
          isExpanded ? "flex max-w-full opacity-100 visible ml-1" : "hidden max-w-0 opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col min-w-0 text-left">
          <span className="text-xs font-medium text-white truncate max-w-[100px]">
            {user.username}
          </span>
          <span className="text-[10px] text-gray-500">
            Lv.{user.level || 1}
          </span>
        </div>

        {roleBadge && (
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ml-auto flex-shrink-0 ${roleBadge.color}`}>
            {roleBadge.label}
          </span>
        )}
      </div>
    </div>
  )}

  {/* ─── 3. AREA MENU UTAMA (CUMA BAGIAN INI YANG BISA SCROLL) ─── */}
  <div className="flex flex-col gap-6 flex-1 overflow-y-auto pr-1 tm-scrollbar">
    <NavGroup
      label="Explore"
      items={exploreItems}
      isExpanded={isExpanded}
      onNavigate={() => { if(window.innerWidth < 1024) setIsExpanded(false); }}
      groupIndex={0}
    />
    {user && (
      <NavGroup
        label="My Space"
        items={userItems}
        isExpanded={isExpanded}
        onNavigate={() => { if(window.innerWidth < 1024) setIsExpanded(false); }}
        groupIndex={1}
      />
    )}
    {isModerator && (
      <NavGroup
        label="Moderation"
        items={moderatorItems}
        isExpanded={isExpanded}
        onNavigate={() => { if(window.innerWidth < 1024) setIsExpanded(false); }}
        groupIndex={2}
      />
    )}
    {isAdmin && (
      <NavGroup
        label="Administration"
        items={adminItems}
        isExpanded={isExpanded}
        onNavigate={() => { if(window.innerWidth < 1024) setIsExpanded(false); }}
        groupIndex={3}
      />
    )}
  </div>

  {/* ─── 4. BOTTOM SECTION (KUNCI DI PALING BAWAH) ─── */}
  <div className="mt-auto pt-4 flex-shrink-0 border-t border-[#2A2A2C]/30">
    {user ? (
      <Button
        variant="outline"
        className={`border-red-900 text-red-400 hover:bg-red-950/30 hover:text-red-300 text-xs h-9 bg-transparent transition-all duration-300 lg:w-full lg:px-4 ${
          isExpanded ? "w-full px-4" : "w-9 p-0"
        }`}
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        title="Logout"
      >
        <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
        <div
          className={`overflow-hidden transition-all duration-300 lg:max-w-full lg:opacity-100 lg:ml-2 ${
            isExpanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0"
          }`}
        >
          <span className="whitespace-nowrap">
            {logoutMutation.isPending ? "..." : "Logout"}
          </span>
        </div>
      </Button>
    ) : (
      <div
        className={`bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg flex flex-col transition-all duration-300 lg:p-3 lg:gap-2 ${
          isExpanded ? "p-3 gap-2" : "p-1 gap-1"
        }`}
      >
        <Button
          variant="outline"
          className={`border-[#2A2A2C] text-[#F0F0F0] hover:bg-[#161618] text-xs h-8 bg-transparent transition-all duration-300 lg:w-full lg:px-3 ${
            isExpanded ? "w-full px-3" : "w-9 p-0"
          }`}
          onClick={() => { navigate("/login"); setIsExpanded(false); }}
          title="Login"
        >
          <LogIn className="h-3.5 w-3.5 flex-shrink-0" />
          <div className={`overflow-hidden transition-all duration-300 lg:max-w-full lg:opacity-100 lg:ml-2 ${isExpanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0"}`}>
            <span className="whitespace-nowrap">Login</span>
          </div>
        </Button>
        <Button
          className={`bg-[#D4AF37] text-black hover:bg-[#c29f2f] text-xs font-bold tracking-tight h-8 transition-all duration-300 lg:w-full lg:px-3 ${
            isExpanded ? "w-full px-3" : "w-9 p-0"
          }`}
          onClick={() => { navigate("/register"); setIsExpanded(false); }}
          title="Register"
        >
          <UserPlus className="h-3.5 w-3.5 flex-shrink-0" />
          <div className={`overflow-hidden transition-all duration-300 lg:max-w-full lg:opacity-100 lg:ml-2 ${isExpanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0"}`}>
            <span className="whitespace-nowrap">Register</span>
          </div>
        </Button>
      </div>
    )}
  </div>
</aside>

      </div>
    </>
  );
}