  // src/features/Admin/F9_UserManagement/types/index.ts
  import type { User } from '../../../../types';

  export interface UserListItem {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
    bio: string | null;
    reputation_points: number;
    level: number;
    is_banned: boolean;
    roles: string[];
    created_at: string;
  }

  export type UserDetail = UserListItem;

  export interface UpdateUserRolePayload {
    role: string;
  }

  export interface UpdateUserProfilePayload {
    username?: string;
    email?: string;
    bio?: string;
  }

  export interface ResetUserPasswordPayload {
    password: string;
    password_confirmation: string;
  }

  export interface AdminStatsOverview {
    status: string;
    message: string;
    data: {
      total_users: number;
      total_posts: number;
      total_comments: number;
      total_categories: number;
      total_tags: number;
      total_badges: number;
      new_users_today: number;
      new_posts_today: number;
    };
  }

  export interface PointsSummaryEntry {
    user_id: string;
    username: string;
    total_points: number;
    actions_count: number;
  }

  export interface PointsSummaryResponse {
    status: string;
    message: string;
    data: PointsSummaryEntry[];
  }

  export interface ActivityChartPoint {
    date: string;
    posts: number;
    comments: number;
  }

  export interface ActivityChartResponse {
    status: string;
    message: string;
    data: ActivityChartPoint[];
  }

  export interface UserListResponse {
    success: boolean; // Menggunakan success: boolean, bukan status: string
    data: {
      current_page: number;
      data: UserListItem[]; // Array user asli bersarang di sini
      first_page_url: string;
      from: number;
      last_page_url: string;
      last_page: number;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  }

  export interface UserDetailResponse {
    success: boolean;
    message: string;
    data: UserDetail;
  }

  export interface UserActionResponse {
    success: boolean;
    message: string;
    data: User;
  }

  export interface AuditLogEntry {
    id: string;
    moderator_id: string;
    target_user_id: string;
    action_type: string;
    reason: string | null;
    notes: string | null;
    created_at: string;
    moderator?: { id: string; username: string; email: string };
    target_user?: { id: string; username: string; email: string };
  }

  export function getActionColor(type: string): string {
    const t = type.toUpperCase();
    if (t.includes('BAN')) return 'text-red-400 bg-red-950/30 border-red-900/50';
    if (t.includes('UNBAN')) return 'text-emerald-400 bg-emerald-950/30 border-emerald-900/50';
    if (t.includes('WARN')) return 'text-amber-400 bg-amber-950/30 border-amber-900/50';
    if (t.includes('HIDE') || t.includes('DELETE')) return 'text-orange-400 bg-orange-950/30 border-orange-900/50';
    if (t.includes('APPROVE') || t.includes('RESOLVE')) return 'text-green-400 bg-green-950/30 border-green-900/50';
    return 'text-blue-400 bg-blue-950/30 border-blue-900/50';
  }

  export function formatTimestamp(dateStr: string): string {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }


 export interface UserTableRowProps {
  user: UserListItem;
  // Menerima string, array string, atau array object dengan property name
  currentUserRole?: string | string[] | Record<string, any>[]; 
  onNavigate: (id: string) => void;
  onRoleChange: (user: UserListItem, role: string) => void;
  onResetPassword: (id: string, username: string) => void;
  onWarn: (id: string, username: string) => void;
  onBanModalOpen: (user: UserListItem) => void;
}