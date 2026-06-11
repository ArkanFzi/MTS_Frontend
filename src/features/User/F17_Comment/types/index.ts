// src/features/User/F17_Comment/types/index.ts
import type { User } from '../../../../types';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  vote_score: number;
  is_accepted: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  replies?: Comment[];
  replies_count?: number;
}

export interface CreateCommentPayload {
  body: string;
}

export interface UpdateCommentPayload {
  body: string;
}

export interface CommentListResponse {
  status: string;
  message: string;
  data: Comment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CommentMutationResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}
