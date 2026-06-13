// src/features/User/F23_LikeSystem/types/index.ts

export interface LikePayload {
  target_id: string;
  target_type: 'post' | 'comment';
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    is_liked: boolean;
    likes_count: number;
  };
}
