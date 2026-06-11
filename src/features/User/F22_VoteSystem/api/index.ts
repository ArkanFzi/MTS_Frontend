import axios from '../../../../lib/axios';
import type { VotePayload, VoteResponse } from '../types';

export const vote = async (data: VotePayload): Promise<VoteResponse> => {
  const response = await axios.post('/api/votes', data);
  return response.data;
};
