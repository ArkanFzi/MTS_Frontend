// src/features/User/F22_VoteSystem/types/index.ts

export interface VotePayload {
  post_id: string;
  type: 'up' | 'down';
}

export interface VoteResponse {
  success: boolean;
  message: string;
  data: {
    vote_score: number;
    user_vote: 'up' | 'down' | null;
  };
}
