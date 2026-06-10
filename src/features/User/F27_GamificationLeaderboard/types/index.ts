// src/features/User/F27_GamificationLeaderboard/types/index.ts

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  reputation_points: number;
  level: number;
}

export interface LeaderboardResponse {
  success: boolean;
  message: string;
  data: LeaderboardEntry[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
}

export type BadgeTier = 'Grandmaster' | 'Master' | 'Expert' | 'Pro';

/** Resolve badge tier from reputation points */
export function getBadgeTier(points: number): BadgeTier {
  if (points >= 20_000) return 'Grandmaster';
  if (points >= 15_000) return 'Master';
  if (points >= 10_000) return 'Expert';
  return 'Pro';
}

/** Badge color config */
export const badgeTierConfig: Record<BadgeTier, { label: string; className: string }> = {
  Grandmaster: {
    label: 'Grandmaster',
    className: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40',
  },
  Master: {
    label: 'Master',
    className: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
  },
  Expert: {
    label: 'Expert',
    className: 'bg-gray-800/50 text-gray-400 border-gray-700',
  },
  Pro: {
    label: 'Pro',
    className: 'bg-gray-800/50 text-gray-500 border-gray-700',
  },
};
