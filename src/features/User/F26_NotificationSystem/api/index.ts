import axios from '../../../../lib/axios';
import type { NotificationItem, MarkReadResponse, MarkAllReadResponse } from '../types';

interface PaginatedNotificationResponse {
  current_page: number;
  data: NotificationItem[];
  last_page: number;
  per_page: number;
  total: number;
}

export const fetchNotifications = async (page = 1): Promise<PaginatedNotificationResponse> => {
  const response = await axios.get(`/api/notifications`, {
    params: { page },
  });
  return response.data;
};

export const markAsRead = async (id: string): Promise<MarkReadResponse> => {
  const response = await axios.patch(`/api/notifications/${id}/read`, {});
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<MarkAllReadResponse> => {
  const response = await axios.patch('/api/notifications/mark-all-read', {});
  return response.data;
};
