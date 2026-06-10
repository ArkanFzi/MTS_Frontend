// src/features/User/F23_LikeSystem/types/index.ts

export interface LikePayload {
  post_id: string;
}

export interface LikeResponse {
  success: boolean;
  message: string;
  data: {
    is_liked: boolean;
    likes_count: number;
  };
}
