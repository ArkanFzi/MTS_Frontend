// src/features/Moderator/F13_ReportQueue/types/index.ts
import type { User } from '../../../../types';

export interface Report {
  id: string;
  reporter_id: string;
  target_id: string;
  target_type: string;
  reason: string;
  description: string | null;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
  reporter?: User;
  resolver?: User | null;
}

export interface UpdateReportPayload {
  status: string;
  resolution_note?: string;
}

export interface ReportListResponse {
  status: string;
  message: string;
  data: Report[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ReportDetailResponse {
  success: boolean;
  message: string;
  data: Report;
}

export interface ReportUpdateResponse {
  success: boolean;
  message: string;
  data: Report;
}
