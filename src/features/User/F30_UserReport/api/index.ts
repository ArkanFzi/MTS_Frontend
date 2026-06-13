// src/features/User/F30_UserReport/api/index.ts
import axios from '../../../../lib/axios';
import type { ReportPayload, CreateReportPayload, ReportResponse } from '../types';

export const submitReport = async (payload: ReportPayload): Promise<ReportResponse> => {
  const response = await axios.post('/api/reports', payload);
  return response.data;
};

// Alias to fix import error in ReportUserModal
export const createReport = async (payload: CreateReportPayload): Promise<ReportResponse> => {
  const submitData = {
    target_id: payload.target_id || payload.reportable_id,
    target_type: payload.target_type || payload.reportable_type,
    reason: payload.reason,
    description: payload.description,
  };
  const response = await axios.post('/api/reports', submitData);
  return response.data;
};
