// src/features/User/F26_NotificationSystem/api/index.ts
import axios from 'axios';
import type { NotificationItem, MarkReadResponse } from '../types';

// Interface penampung pembungkus API lokal
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

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchNotifications = async (page = 1): Promise<PaginatedLocalResponse<NotificationItem>> => {
  const response = await axios.get(`/api/notifications?page=${page}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const markAsRead = async (id: string): Promise<ApiLocalResponse<null>> => {
  const response = await axios.patch(`/api/notifications/${id}/read`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<MarkReadResponse> => {
  const response = await axios.patch('/api/notifications/mark-all-read', {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};