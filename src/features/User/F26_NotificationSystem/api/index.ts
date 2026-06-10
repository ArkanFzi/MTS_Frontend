// src/features/User/F26_NotificationSystem/api/index.ts
import axios from 'axios';
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

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ DIUBAH: Menggunakan ApiLocalResponse<PaginatedLocalResponse<...>> agar serasi dengan panggilan res.data.data di Page
export const fetchNotifications = async (page = 1): Promise<ApiLocalResponse<PaginatedLocalResponse<NotificationItem>>> => {
  const response = await axios.get(`/api/notifications?page=${page}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const markAsRead = async (id: string): Promise<ApiLocalResponse<null>> => {
  // Jika backend kamu ternyata memakai Route::put atau Route::post, ubah .patch di bawah ini menyesuaikan backend
  const response = await axios.patch(`/api/notifications/${id}/read`, {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<MarkReadResponse> => {
  // Jika backend kamu ternyata memakai Route::put atau Route::post, ubah .patch di bawah ini menyesuaikan backend
  const response = await axios.patch('/api/notifications/mark-all-read', {}, {
    headers: getAuthHeader(),
  });
  return response.data;
};