// src/features/Moderator/F15_UserBanSanction/types/index.ts
import type { User } from '../../../../types';

export interface Ban {
  id: string;
  user_id: string;
  reason: string;
  duration_days: number | null;
  is_permanent: boolean;
  banned_at: string;
  expires_at: string | null;
  user?: User;
}

export interface WarnPayload {
  reason: string;
  notes?: string;
}

export interface BanPayload {
  reason: string;
  duration_days?: number;
}

export interface BanListResponse {
  data: {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface BanActionResponse {
  success: boolean;
  message: string;
  data: Ban;
}

export interface UnbanResponse {
  success: boolean;
  message: string;
}
