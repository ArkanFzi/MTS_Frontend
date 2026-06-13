import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import type { NotificationItem } from '../../features/User/F26_NotificationSystem/types';
import { fetchNotifications, markAsRead, markAllNotificationsAsRead } from '../../features/User/F26_NotificationSystem/api';
import { NotificationRow } from '../../features/User/F26_NotificationSystem/components/NotificationRow';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 1],
    queryFn: () => fetchNotifications(1),
  });

  const notifications: NotificationItem[] = data?.data ?? [];
  const totalUnread = notifications.filter((item) => !item.is_read).length;

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
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <Card className="bg-[#161618] border border-zinc-800 shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-6 border-b border-zinc-800">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#D4AF37]" />Inbox Notifikasi
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Kamu memiliki {totalUnread} notifikasi baru yang belum dibaca.
            </CardDescription>
          </div>

          {totalUnread > 0 && (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              size="sm"
              disabled={markAllMutation.isPending}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" /> Tandai semua dibaca
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-12 space-y-3">
              <Bell className="h-12 w-12 text-zinc-700 stroke-[1.5]" />
              <p className="text-zinc-400 text-sm">Kotak masukmu bersih. Tidak ada notifikasi saat ini.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkOneRead}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
