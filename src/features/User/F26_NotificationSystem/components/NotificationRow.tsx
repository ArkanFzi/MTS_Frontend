// src/features/User/F26_NotificationSystem/components/NotificationRow.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import type { NotificationItem } from '../types';
import { Bell, CheckCircle2, MessageSquare, ThumbsUp, Award, UserCheck } from 'lucide-react';
import TechnicalTimestamp from '../../../../components/shared/TechnicalTimestamp';

interface NotificationRowProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
}

// Helper: build human-readable message (Tanpa actorName di dalam string agar tidak double)
function buildMessage(notification: NotificationItem): string {
  switch (notification.type) {
    // Interaksi Konten
    case 'like_post':
      return `menyukai postingan Anda.`;
    case 'like_comment':
      return `menyukai komentar Anda.`;
    case 'upvote_post':
      return `memberikan upvote pada postingan Anda.`;
    case 'upvote_comment':
      return `memberikan upvote pada komentar Anda.`;
    case 'new_comment':
      return `memberikan jawaban pada postingan Anda.`;
    case 'comment_reply':
      return `membalas komentar Anda.`;
    case 'answer_accepted':
      return `menerima jawaban Anda.`;
    
    // Sosial
    case 'followed':
      return `mulai mengikuti Anda.`;
    
    // Sistem & Profil (Milik user sendiri, diarahkan ke settings)
    case 'complete_profile_reminder':
      return `Selamat datang! Jangan lupa lengkapi profil Anda.`;
    case 'profile_completed':
      return `Profil Anda sekarang lengkap! Terima kasih.`;
    case 'badge_awarded':
      return `Selamat! Anda mendapatkan badge baru.`;

    // Moderasi & Admin
    case 'new_report':
      return `melaporkan sebuah konten.`;
    case 'report_updated':
      return `Laporan Anda telah diproses oleh moderator.`;
    case 'user_banned':
      return `Akun Anda telah di-ban oleh moderator.`;
    case 'user_warned':
      return `Anda mendapatkan peringatan dari moderator.`;
    case 'role_assigned':
      return `Role Anda telah diperbarui oleh admin.`;

    default:
      return `berinteraksi dengan konten Anda.`;
  }
}

// Helper: Resolve link untuk KLIK CARD UTAMA (Bukan klik profil pelaku)
function buildLink(notification: NotificationItem): string | null {
  // Notifikasi tertentu mungkin tidak punya reference_id tapi butuh link tetap
  if (notification.type === 'complete_profile_reminder' || notification.type === 'profile_completed') {
    return '/settings/profile';
  }
  
  // 🌟 HANDLE DETAIL WARNING
  if (notification.type === 'user_warned') {
    return '/me/warnings'; 
    // Catatan: Jika halaman warning kamu butuh ID spesifik, ganti menjadi:
    // return `/me/warnings/${notification.reference_id}`;
  }

  if (!notification.reference_id) return null;
  
  if (notification.type === 'followed') {
    return `/profile/${notification.reference_id}`;
  }

  if (notification.type === 'new_report' || notification.type === 'report_updated') {
    return `/moderator/reports`;
  }

  switch (notification.reference_type) {
    case 'post':
      return `/posts/${notification.reference_id}`;
    case 'comment':
      if (notification.reference && notification.reference.post_id) {
        return `/posts/${notification.reference.post_id}`;
      }
      return `/posts/${notification.reference_id}`;
    case 'user':
    case 'App\\Models\\Auth\\User':
      return `/profile/${notification.reference_id}`;
    default:
      return null;
  }
}

export const NotificationRow: React.FC<NotificationRowProps> = ({ notification, onMarkRead }) => {
  const navigate = useNavigate();
  const { id, is_read, created_at, type, actor } = notification;
  const message = buildMessage(notification);
  const link = buildLink(notification);

  // Handler klik card utama (ke arah konten/post/laporan/warning)
  const handleNotificationClick = () => {
    if (!is_read) {
      onMarkRead(id);
    }
    if (link) {
      navigate(link);
    }
  };

  // Handler klik Avatar / Username pelaku (Pasti ke PROFIL PUBLIK orang tersebut)
  const handleActorClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah card utama ikut ter-klik
    if (actor?.id) {
      navigate(`/profile/${actor.id}`); 
    }
  };

  const renderIcon = () => {
    if (type.includes('comment') || type.includes('answer')) {
      return <MessageSquare className="h-4 w-4 text-lime-500" />;
    }
    if (type.includes('accepted')) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
    if (type.includes('vote') || type.includes('like')) {
      return <ThumbsUp className="h-4 w-4 text-amber-500" />;
    }
    if (type.includes('badge')) {
      return <Award className="h-4 w-4 text-[#D4AF37]" />;
    }
    if (type === 'profile_completed') {
      return <UserCheck className="h-4 w-4 text-cyan-500" />;
    }
    // Mengubah warna icon bell/warning khusus jika tipenya user_warned
    if (type === 'user_warned') {
      return <Bell className="h-4 w-4 text-red-500 animate-pulse" />;
    }
    return <Bell className="h-4 w-4 text-zinc-400" />;
  };

  return (
    <div
      onClick={handleNotificationClick}
      className={`flex items-start gap-4 p-4 border-b border-zinc-800 transition-all cursor-pointer hover:bg-zinc-900/60 ${
        !is_read ? 'bg-[#161618] border-l-2 border-l-[#D4AF37]' : ''
      }`}
    >
      {/* KOTAK AVATAR (MENGARAH KE PROFIL PUBLIK PELAKU) */}
      <div 
        onClick={handleActorClick} 
        className="relative shrink-0 cursor-pointer group/avatar"
      >
        <Avatar className="h-10 w-10 border border-zinc-700 transition-colors group-hover/avatar:border-zinc-500">
          {actor?.avatar_url ? (
            <AvatarImage src={actor.avatar_url} alt={actor.username} />
          ) : (
            <AvatarFallback className="bg-zinc-800 text-zinc-400 font-semibold">
              {actor?.username ? actor.username.substring(0, 2).toUpperCase() : 'SYS'}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="absolute -bottom-1 -right-1 p-1 bg-zinc-950 rounded-full border border-zinc-800">
          {renderIcon()}
        </div>
      </div>

      {/* KONTEN TEKS NOTIFIKASI */}
      <div className="flex-1 space-y-1">
        <div className="text-sm text-zinc-200">
          {actor && (
            /* USERNAME (MENGARAH KE PROFIL PUBLIK PELAKU) */
            <span 
              onClick={handleActorClick}
              className="font-bold text-zinc-100 mr-1 hover:underline cursor-pointer"
            >
              {actor.username}
            </span>
          )}
          {message}
        </div>
        <div className="text-xs">
          <TechnicalTimestamp timestamp={created_at} />
        </div>
      </div>

      {/* TOMBOL TANDAI DIBACA */}
      {!is_read && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation(); // Mencegah card utama ikut ter-klik
            onMarkRead(id);
          }}
        >
          Tandai dibaca
        </Button>
      )}
    </div>
  );
};

export default NotificationRow;