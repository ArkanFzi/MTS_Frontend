import axios from '../../../../lib/axios';
import type { LeaderboardResponse } from '../types';

export const getLeaderboard = async (page = 1, limit = 10): Promise<LeaderboardResponse> => {
  const response = await axios.get('/api/explore/leaderboard', {
    params: { page, limit },
  });
  return response.data;
};
