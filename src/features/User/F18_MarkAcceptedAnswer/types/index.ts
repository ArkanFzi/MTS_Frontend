// src/features/User/F18_MarkAcceptedAnswer/types/index.ts
import type { Comment } from '../../F17_Comment/types/index';

export interface MarkAcceptedAnswerResponse {
  success: boolean;
  message: string;
  data: Comment;
}
