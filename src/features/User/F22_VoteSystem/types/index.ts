// src/features/User/F22_VoteSystem/types/index.ts

export interface VotePayload {
  target_id: string;
  target_type: 'post' | 'comment';
  type: 'up' | 'down';
}

export interface VoteResponse {
  message: string;
  new_score: number;
}
