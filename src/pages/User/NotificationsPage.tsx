import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import type { NotificationItem } from '../../features/User/F26_NotificationSystem/types';
import { fetchNotifications, markAsRead, markAllNotificationsAsRead } from '../../features/User/F26_NotificationSystem/api';
import { NotificationRow } from '../../features/User/F26_NotificationSystem/components/NotificationRow';
import { Bell, CheckCheck } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalUnread, setTotalUnread] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const loadNotifications = async () => {
      try {
        if (isMounted) setLoading(true);
        const res = await fetchNotifications(1);
        
        if (isMounted) {
          // 🟢 PERBAIKAN: Ambil array dari res.data.data karena struktur respons berformat pagination Laravel
          const notificationArray = res.data?.data || [];
          setNotifications(notificationArray);
          
          const unreadCount = notificationArray.filter((item: NotificationItem) => item.read_at === null).length;
          setTotalUnread(unreadCount);
        }
      } catch (error) {
        console.error('Gagal memuat notifikasi:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkOneRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read_at: new Date().toISOString() } : item))
      );
      setTotalUnread((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Gagal memperbarui status notifikasi:', error);
    }
  };

  const handleMarkAllRead = async () => {
    if (totalUnread === 0) return;
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read_at: new Date().toISOString() }))
      );
      setTotalUnread(0);
    } catch (error) {
      console.error('Gagal memperbarui seluruh status notifikasi:', error);
    }
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
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" /> Tandai semua dibaca
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <LoadingSpinner />
            </div>
          ) : !notifications || notifications.length === 0 ? ( // 🟢 PERBAIKAN: Validasi gerbang aman jika data belum siap
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