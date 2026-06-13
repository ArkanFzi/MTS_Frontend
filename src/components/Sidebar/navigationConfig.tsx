// src/components/layout/Sidebar/navigationConfig.tsx

import {
  Home, TrendingUp, Tag, Trophy, Search, BookMarked, Bell,
  FileText, Award, Settings, PenSquare, Shield, ShieldAlert,
  Users, LayoutDashboard, Tags, ClipboardList
} from "lucide-react";
import type { ReactNode } from "react";

export interface NavItem {
  name: string;
  path?: string;
  icon: ReactNode;
  children?: { name: string; path: string }[];
}

export const exploreItems: NavItem[] = [
  { name: "Home Feed", path: "/", icon: <Home className="h-4 w-4 flex-shrink-0" /> },
  { name: "Search Posts", path: "/search", icon: <Search className="h-4 w-4 flex-shrink-0" /> },
  { name: "Trending", path: "/trending", icon: <TrendingUp className="h-4 w-4 flex-shrink-0" /> },
  { name: "All Tags", path: "/tags", icon: <Tag className="h-4 w-4 flex-shrink-0" /> },
  { name: "Leaderboard", path: "/leaderboard", icon: <Trophy className="h-4 w-4 flex-shrink-0" /> },
];

export const moderatorItems: NavItem[] = [
  { name: "Report Queue", path: "/moderator/reports", icon: <Shield className="h-4 w-4 flex-shrink-0" /> },
  {
    name: "Penalties & Logs",
    icon: <ShieldAlert className="h-4 w-4 flex-shrink-0" />,
    children: [
      { name: "Ban Management", path: "/moderator/bans" },
      { name: "Action Logs", path: "/moderator/logs" },
    ],
  },
  { name: "Tags & Categories", path: "/moderator/tag-category", icon: <Tags className="h-4 w-4 flex-shrink-0" /> },
];

export const adminItems: NavItem[] = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4 flex-shrink-0" /> },
  {
    name: "Users Control",
    icon: <Users className="h-4 w-4 flex-shrink-0" />,
    children: [
      { name: "User Directory", path: "/admin/users" },
      { name: "Role Management", path: "/admin/roles" },
    ],
  },
  {
    name: "Platform Master",
    icon: <ClipboardList className="h-4 w-4 flex-shrink-0" />,
    children: [
      { name: "Categories Manager", path: "/admin/tag-category" },
      { name: "Badge Master", path: "/admin/badges" },
      { name: "System Audit Logs", path: "/admin/audit-logs" },
    ],
  },
];

// Fungsi dinamis untuk generate menu user berdasarkan ID log-in
export const getUserItems = (userId?: string): NavItem[] => [
  {
    name: "Posts Hub",
    icon: <FileText className="h-4 w-4 flex-shrink-0" />,
    children: [
      { name: "Create Post", path: "/posts/create" },
      { name: "My Posts", path: "/me/posts" },
      { name: "Bookmarks", path: "/bookmarks" },
    ],
  },
  { name: "Notifications", path: "/notifications", icon: <Bell className="h-4 w-4 flex-shrink-0" /> },
  { name: "My Badges", path: "/me/badges", icon: <Award className="h-4 w-4 flex-shrink-0" /> },
  {
    name: "Settings",
    icon: <Settings className="h-4 w-4 flex-shrink-0" />,
    children: [
      { name: "Change Profile", path: "/settings/profile" },
      { name: "Public Profile", path: userId ? `/profile/${userId}` : "#" },
    ],
  },
];