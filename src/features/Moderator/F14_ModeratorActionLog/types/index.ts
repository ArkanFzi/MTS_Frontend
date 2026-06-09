// src/features/Moderator/F14_ModeratorActionLog/types/index.ts
import type { User } from '../../../../types';

export interface ModerationLog {
  id: string;
  moderator_id: string;
  target_user_id: string;
  action_type: string;
  reason: string | null;
  notes: string | null;
  created_at: string;
  moderator?: User;
  target_user?: User;
}

export interface ModerationLogListResponse {
  status: string;
  message: string;
  data: ModerationLog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
