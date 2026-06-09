import axios from '../../../../lib/axios';
import type { NotificationItem, MarkReadResponse } from '../types';

export interface ApiLocalResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedLocalResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const fetchNotifications = async (page = 1): Promise<PaginatedLocalResponse<NotificationItem>> => {
  const response = await axios.get(`/api/notifications`, {
    params: { page },
  });
  return response.data;
};

export const markAsRead = async (id: string): Promise<ApiLocalResponse<null>> => {
  const response = await axios.patch(`/api/notifications/${id}/read`, {});
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<MarkReadResponse> => {
  const response = await axios.patch('/api/notifications/mark-all-read', {});
  return response.data;
};
