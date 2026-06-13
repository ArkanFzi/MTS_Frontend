// src/features/User/F29_BadgeAchievement/types/index.ts

import type { BadgeTier, ConditionType } from '../../../Admin/F11_BadgeMaster/types';

export interface BadgeItem {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  tier: BadgeTier | null;
  condition_type: ConditionType | null;
  condition_value: number | null;
  /** Populated when badge is earned; null = locked */
  earned_at: string | null;
}

export interface AllBadgesResponse {
  success: boolean;
  data: BadgeItem[];
}

export interface BadgeStats {
  unlocked: number;
  locked: number;
}
