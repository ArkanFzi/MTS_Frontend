// src/features/User/F26_NotificationSystem/types/index.ts

// Kita gunakan interface lokal atau relative path agar aman dari kendala path alias
export interface BaseNotification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationActor {
  id: string;
  username: string;
  avatar_url: string | null;
}

export interface NotificationPayload {
  message: string;
  link?: string;
  actor?: NotificationActor;
  post_id?: string;
  comment_id?: string;
}

// Menghilangkan warisan yang bertubrukan dan menggunakan payload terdefinisi rapi
export interface NotificationItem extends Omit<BaseNotification, 'data'> {
  data: NotificationPayload;
}

export interface MarkReadResponse {
  message: string;
  unread_count: number;
}