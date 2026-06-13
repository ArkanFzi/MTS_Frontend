// src/features/Moderator/F13_ReportQueue/types/index.ts
import type { User } from '../../../../types';

export interface Report {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: 'post' | 'comment' | 'user';
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
  reporter?: User;
  target?: Record<string, unknown> | null; // The target (Post, Comment, or User)
}

export interface UpdateReportPayload {
  status: 'resolved' | 'dismissed';
  action?: 'warn' | 'ban' | 'delete_content' | 'none';
  reason?: string;
}

export interface ReportListResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Report[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ReportDetailResponse {
  success: boolean;
  data: Report;
}

export interface ReportUpdateResponse {
  success: boolean;
  message: string;
  data: Report;
}

export type FilterStatus = 'all' | 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export const FILTER_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewed', value: 'reviewed' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Dismissed', value: 'dismissed' },
];
