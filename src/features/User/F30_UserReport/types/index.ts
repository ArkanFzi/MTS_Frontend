// src/features/User/F30_UserReport/types/index.ts

export interface CreateReportPayload {
  reportable_type: string;
  reportable_id: string;
  reason: string;
  description?: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    reporter_id: string;
    target_id: string;
    target_type: string;
    reason: string;
    description: string | null;
    status: string;
    created_at: string;
  };
}
