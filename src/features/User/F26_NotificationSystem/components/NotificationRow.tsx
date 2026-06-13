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

// Helper: build human-readable message from notification type + actor
function buildMessage(notification: NotificationItem): string {
  const actorName = notification.actor?.username || 'Sistem';
  switch (notification.type) {
    // Interaksi Konten
    case 'like_post':
      return `${actorName} menyukai postingan Anda.`;
    case 'like_comment':
      return `${actorName} menyukai komentar Anda.`;
    case 'upvote_post':
      return `${actorName} memberikan upvote pada postingan Anda.`;
    case 'upvote_comment':
      return `${actorName} memberikan upvote pada komentar Anda.`;
    case 'new_comment':
      return `${actorName} memberikan jawaban pada postingan Anda.`;
    case 'comment_reply':
      return `${actorName} membalas komentar Anda.`;
    case 'answer_accepted':
      return `${actorName} menerima jawaban Anda.`;
    
    // Sosial
    case 'followed':
      return `${actorName} mulai mengikuti Anda.`;
    
    // Sistem & Profil
    case 'complete_profile_reminder':
      return `Selamat datang! Jangan lupa lengkapi profil Anda.`;
    case 'profile_completed':
      return `Profil Anda sekarang lengkap! Terima kasih.`;
    case 'badge_awarded':
      return `Selamat! Anda mendapatkan badge baru.`;

    // Moderasi & Admin
    case 'new_report':
      return `${actorName} melaporkan sebuah konten.`;
    case 'report_updated':
      return `Laporan Anda telah diproses oleh moderator.`;
    case 'user_banned':
      return `Akun Anda telah di-ban oleh moderator.`;
    case 'user_warned':
      return `Anda mendapatkan peringatan dari moderator.`;
    case 'role_assigned':
      return `Role Anda telah diperbarui oleh admin.`;

    default:
      return `${actorName} berinteraksi dengan konten Anda.`;
  }
}

// Helper: resolve link from reference_type + reference_id
function buildLink(notification: NotificationItem): string | null {
  if (!notification.reference_id) return null;
  
  if (notification.type === 'complete_profile_reminder' || notification.type === 'profile_completed') {
    return '/settings/profile';
  }
  
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
      // Jika reference ter-load dari backend, dan punya post_id:
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

  const handleNotificationClick = () => {
    if (!is_read) {
      onMarkRead(id);
    }
    if (link) {
      navigate(link);
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
    return <Bell className="h-4 w-4 text-zinc-400" />;
  };

  return (
    <div
      onClick={handleNotificationClick}
      className={`flex items-start gap-4 p-4 border-b border-zinc-800 transition-all cursor-pointer hover:bg-zinc-900/60 ${
        !is_read ? 'bg-[#161618] border-l-2 border-l-[#D4AF37]' : ''
      }`}
    >
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10 border border-zinc-700">
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

      <div className="flex-1 space-y-1">
        <div className="text-sm text-zinc-200">
          {actor && (
            <span className="font-bold text-zinc-100 mr-1 hover:underline">
              {actor.username}
            </span>
          )}
          {message}
        </div>
        <div className="text-xs">
          <TechnicalTimestamp timestamp={created_at} />
        </div>
      </div>

      {!is_read && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
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
