import axios from '../../../../lib/axios';
import type { CreateReportPayload, ReportResponse } from '../types';

export const createReport = async (data: CreateReportPayload): Promise<ReportResponse> => {
  const response = await axios.post('/api/reports', data);
  return response.data;
};
