import axios from '../../../../lib/axios';
import type { AllBadgesResponse } from '../types';

/**
 * Fetch ALL badges with earned_at populated for unlocked ones.
 * Backend returns earned_at = null for locked badges.
 */
export const getAllBadgesForUser = async (): Promise<AllBadgesResponse> => {
  const response = await axios.get('/api/me/badges');
  return response.data;
};
