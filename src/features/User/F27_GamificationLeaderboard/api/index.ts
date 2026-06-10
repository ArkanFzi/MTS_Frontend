import axios from '../../../../lib/axios';
import type { LeaderboardResponse } from '../types';

export const getLeaderboard = async (): Promise<LeaderboardResponse> => {
  const response = await axios.get('/api/explore/leaderboard');
  return response.data;
};
