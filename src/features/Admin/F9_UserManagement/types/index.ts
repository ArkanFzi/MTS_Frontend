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

export interface UserDetail extends UserListItem {}

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

export interface UserListResponse {
  status: string;
  message: string;
  data: UserListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
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
