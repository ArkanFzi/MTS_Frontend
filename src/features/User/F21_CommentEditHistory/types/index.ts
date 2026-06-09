// src/features/User/F21_CommentEditHistory/types/index.ts
import type { User } from '../../../../types';

export interface CommentEditHistory {
  id: string;
  comment_id: string;
  edited_by: string;
  body_before: string;
  body_after: string;
  edited_at: string;
  editor?: User;
}

export interface CommentEditHistoryResponse {
  status: string;
  message: string;
  data: CommentEditHistory[];
}
