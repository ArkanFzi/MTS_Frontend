// src/features/User/F29_BadgeAchievement/types/index.ts

export interface BadgeItem {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  tier: string | null;
  condition_type: string | null;
  condition_value: number | null;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: BadgeItem;
}

export interface UserBadgeListResponse {
  status: string;
  message: string;
  data: UserBadge[];
}
