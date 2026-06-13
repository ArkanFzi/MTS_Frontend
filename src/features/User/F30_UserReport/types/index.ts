// src/features/User/F30_UserReport/types/index.ts

export interface CreateReportPayload {
  reportable_id?: string;
  reportable_type?: 'post' | 'comment' | 'user';
  target_id?: string;
  target_type?: 'post' | 'comment' | 'user';
  reason: string;
  description?: string;
}

export type ReportPayload = CreateReportPayload;

export interface ReportResponse {
  message: string;
  data?: Record<string, unknown>;
}
