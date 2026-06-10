// src/features/User/F27_GamificationLeaderboard/types/index.ts

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url: string | null;
  reputation_points: number;
  level: number;
  rank: number;
  posts_count?: number;
  comments_count?: number;
}

export interface LeaderboardResponse {
  status: string;
  message: string;
  data: LeaderboardEntry[];
}
