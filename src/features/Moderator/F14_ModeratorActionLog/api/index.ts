import axios from '../../../../lib/axios';
import type { ModerationLogListResponse } from '../types';

export const getModerationLogs = async (page = 1): Promise<ModerationLogListResponse> => {
  const response = await axios.get('/api/moderator/logs', { params: { page } });
  return response.data;
};
