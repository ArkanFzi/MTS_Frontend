// src/features/User/F25_FollowUser/types/index.ts

export interface FollowerItem {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  reputation_points: number;
  is_following?: boolean;
}

export interface ToggleFollowResponse {
  success: boolean;
  message: string;
  data: {
    is_following: boolean;
    followers_count: number;
  };
}

export interface FollowListResponse {
  status: string;
  message: string;
  data: FollowerItem[];
}

export interface UserProfileData {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  reputation_points: number;
  level: number;
  is_banned: boolean;
  roles: string[];
  posts_count: number;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
  created_at: string;
}

export interface UserProfileResponse {
  status: string;
  message: string;
  data: UserProfileData;
}
