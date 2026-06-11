// src/features/User/F19_PostEditHistory/types/index.ts
import type { User } from '../../../../types';

export interface PostEditHistory {
  id: string;
  post_id: string;
  edited_by: string;
  body_before: string;
  body_after: string;
  reason: string | null;
  edited_at: string;
  editor?: User;
}

export interface PostEditHistoryResponse {
  status: string;
  message: string;
  data: PostEditHistory[];
}
