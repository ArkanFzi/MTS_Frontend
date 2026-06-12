// src/features/Admin/F11_BadgeMaster/types/index.ts

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type ConditionType =
  | 'reputation_points'
  | 'post_count'
  | 'comment_count'
  | 'upvote_received'
  | 'answer_accepted';

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  tier: BadgeTier | null;
  condition_type: ConditionType | null;
  condition_value: number | null;
  created_at: string;
}

export interface CreateBadgePayload {
  name: string;
  description: string;
  icon_url: string;
  tier: BadgeTier;
  condition_type: ConditionType;
  condition_value: number;
}

export interface UpdateBadgePayload {
  name?: string;
  description?: string;
  icon_url?: string;
  tier?: BadgeTier;
  condition_type?: ConditionType;
  condition_value?: number;
}

// Matches Laravel LengthAwarePaginator JSON shape
export interface BadgeListResponse {
  success: boolean;
  data: {
    data: Badge[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export interface BadgeMutationResponse {
  success: boolean;
  message: string;
  data: Badge;
}

export interface DeleteBadgeResponse {
  success: boolean;
  message: string;
}
