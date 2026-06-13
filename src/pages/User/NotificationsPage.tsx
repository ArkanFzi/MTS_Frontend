// src/pages/User/NotificationsPage.tsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';
import type { NotificationItem } from '../../features/User/F26_NotificationSystem/types';
import { fetchNotifications, markAsRead, markAllNotificationsAsRead } from '../../features/User/F26_NotificationSystem/api';
import { NotificationRow } from '../../features/User/F26_NotificationSystem/components/NotificationRow';
import { Bell, CheckCheck, AlertCircle } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // 1. Mengambil data notifikasi menggunakan React Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications', 1],
    queryFn: () => fetchNotifications(1),
  });

  const notifications: NotificationItem[] = data?.data ?? [];
  const totalUnread = notifications.filter((item) => !item.is_read).length;

  // 2. Mutations untuk menandai dibaca
  const markOneMutation = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleMarkOneRead = (id: string) => {
    markOneMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    if (totalUnread === 0) return;
    markAllMutation.mutate();
  };

  return (
    <ResponsiveLayout>
      {/* w-full py-8 dengan padding responsif menyamakan standar MyPostsPage */}
      <div className="w-full py-8 px-4 md:px-0 space-y-6">
        
        {/* ── Header (Mengikuti layout MyPostsPage) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-6 h-6 text-[#D4AF37]" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Inbox Notifikasi
              </h1>
            </div>
            <p className="text-sm text-gray-400 ml-9">
              {isLoading 
                ? 'Memuat notifikasi...' 
                : `${totalUnread} notifikasi baru belum dibaca`}
            </p>
          </div>

          {/* Tombol Aksi Tandai Semua Dibaca */}
          {totalUnread > 0 && (
            <Button
              onClick={handleMarkAllRead}
              disabled={markAllMutation.isPending}
              className="bg-transparent border border-zinc-800 text-zinc-300 hover:text-white hover:bg-[#1A1A1C] hover:border-zinc-700 font-bold text-sm px-5 py-2.5 h-auto rounded-full transition-all cursor-pointer gap-2 self-start sm:self-auto"
            >
              <CheckCheck className="w-4 h-4 stroke-[2.5]" />
              Tandai semua dibaca
            </Button>
          )}
        </div>

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center p-6">
            <LoadingSpinner />
          </div>
        )}

        {/* ── Error State (Meniru desain error MyPostsPage) ── */}
        {isError && (
          <div className="text-center py-20 border border-red-900/20 bg-red-950/5 rounded-xl">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2 opacity-50" />
            <p className="text-red-400 text-sm">Gagal memuat kotak masuk notifikasi kamu.</p>
          </div>
        )}

        {/* ── Empty State (Meniru desain empty state MyPostsPage) ── */}
        {!isLoading && !isError && notifications.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl animate-in fade-in duration-300">
            <Bell className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Kotak masukmu bersih. Tidak ada notifikasi saat ini.</p>
          </div>
        )}

        {/* ── Notifications List (Urutan rapi dengan efek animasi per baris) ── */}
        {!isLoading && !isError && notifications.length > 0 && (
          <div className="flex flex-col border border-zinc-900/80 rounded-xl bg-[#111112] divide-y divide-zinc-900/60 overflow-hidden">
            {notifications.map((notification, index) => (
              <div
                key={notification.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <NotificationRow
                  notification={notification}
                  onMarkRead={handleMarkOneRead}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </ResponsiveLayout>
  );
};

export default NotificationsPage;