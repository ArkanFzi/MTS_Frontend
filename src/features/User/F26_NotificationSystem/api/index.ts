// src/features/User/F26_NotificationSystem/api/index.ts
import axios from '../../../../lib/axios';
import type { NotificationItem, MarkAllReadResponse } from '../types';

// Matches Laravel LengthAwarePaginator JSON shape
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const fetchNotifications = async (page = 1): Promise<PaginatedResponse<NotificationItem>> => {
  const response = await axios.get('/api/notifications', { params: { page } });
  return response.data;
};

export const markAsRead = async (id: string): Promise<{ success: boolean }> => {
  const response = await axios.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<MarkAllReadResponse> => {
  const response = await axios.patch('/api/notifications/mark-all-read');
  return response.data;
};
