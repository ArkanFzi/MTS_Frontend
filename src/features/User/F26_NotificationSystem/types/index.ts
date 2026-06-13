// src/features/User/F26_NotificationSystem/types/index.ts

// Matches backend notifications table: id, user_id, actor_id, type, reference_id, reference_type, is_read, created_at
export interface NotificationItem {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
  actor?: NotificationActor | null;
  reference?: Record<string, unknown> | null;
}

export interface NotificationActor {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface MarkAllReadResponse {
  message: string;
}
