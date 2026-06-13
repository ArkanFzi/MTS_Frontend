// src/features/User/F20_NestedCommentReply/types/index.ts
import type { User } from '../../../../types';

export interface Reply {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string;
  body: string;
  vote_score: number;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  is_liked?: boolean;
  likes_count?: number;
}

export interface CreateReplyPayload {
  body: string;
}

export interface UpdateReplyPayload {
  body: string;
}

export interface ReplyMutationResponse {
  success: boolean;
  message: string;
  data: Reply;
}
