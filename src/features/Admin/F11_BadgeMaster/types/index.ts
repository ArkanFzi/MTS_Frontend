// src/features/Admin/F11_BadgeMaster/types/index.ts

export interface Badge {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  tier: string | null;
  condition_type: string | null;
  condition_value: number | null;
  created_at: string;
}

export interface CreateBadgePayload {
  name: string;
  description?: string;
  icon_url?: string;
  requirement_type?: string;
  requirement_value?: number;
}

export interface UpdateBadgePayload {
  name?: string;
  description?: string;
  icon_url?: string;
  requirement_type?: string;
  requirement_value?: number;
}

export interface BadgeListResponse {
  status: string;
  message: string;
  data: Badge[];
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
