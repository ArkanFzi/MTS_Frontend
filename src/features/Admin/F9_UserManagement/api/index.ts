// src/features/Admin/F9_UserManagement/api.ts
import axios from '../../../../lib/axios';
import type {
  UserListResponse,
  UserDetailResponse,
  UserActionResponse,
  UpdateUserRolePayload,
  UpdateUserProfilePayload,
  ResetUserPasswordPayload,
  AdminStatsOverview,
  PointsSummaryResponse,
  ActivityChartResponse,
} from '../types';

export const getUsers = async (page = 1, search = ''): Promise<UserListResponse> => {
  const response = await axios.get('/api/admin/users', { params: { page, search: search.trim() || undefined } });
  return response.data;
};

export const getUser = async (id: string): Promise<UserDetailResponse> => {
  const response = await axios.get(`/api/admin/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id: string, data: UpdateUserRolePayload): Promise<UserActionResponse> => {
  const response = await axios.put(`/api/admin/users/${id}/role`, data);
  return response.data;
};

export const updateUserProfile = async (id: string, data: UpdateUserProfilePayload): Promise<UserActionResponse> => {
  const response = await axios.put(`/api/admin/users/${id}/profile`, data);
  return response.data;
};

export const resetUserPassword = async (id: string, data: ResetUserPasswordPayload): Promise<{ success: boolean; message: string }> => {
  const response = await axios.put(`/api/admin/users/${id}/reset-password`, data);
  return response.data;
};

export const getAdminStats = async (): Promise<AdminStatsOverview> => {
  const response = await axios.get('/api/admin/stats/overview');
  return response.data;
};

export const getPointsSummary = async (): Promise<PointsSummaryResponse> => {
  const response = await axios.get('/api/admin/stats/points-summary');
  return response.data;
};

export const getAuditLogs = async (page = 1) => {
  const response = await axios.get('/api/admin/audit-logs', { params: { page } });
  return response.data;
};

export const getActivityChart = async (): Promise<ActivityChartResponse> => {
  const response = await axios.get('/api/admin/stats/activity-chart');
  return response.data;
};

// Tambahkan parameter `reason` di fungsi toggleUserBan
export const toggleUserBan = async (id: string, isBanned: boolean, reason: string): Promise<UserActionResponse> => {
  const action = isBanned ? 'unban' : 'ban';
  // Kirim data { reason } sebagai argumen kedua di axios.post
  const response = await axios.post(`/api/moderator/bans/${id}/${action}`, { reason });
  return response.data;
};