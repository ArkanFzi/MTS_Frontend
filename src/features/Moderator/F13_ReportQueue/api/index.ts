import axios from '../../../../lib/axios';
import type {
  UpdateReportPayload,
  ReportListResponse,
  ReportDetailResponse,
  ReportUpdateResponse,
} from '../types';

export const getReports = async (page = 1): Promise<ReportListResponse> => {
  const response = await axios.get('/api/moderator/reports', { params: { page } });
  return response.data;
};

export const getReport = async (id: string): Promise<ReportDetailResponse> => {
  const response = await axios.get(`/api/moderator/reports/${id}`);
  return response.data;
};

export const updateReport = async (id: string, data: UpdateReportPayload): Promise<ReportUpdateResponse> => {
  const response = await axios.put(`/api/moderator/reports/${id}`, data);
  return response.data;
};
