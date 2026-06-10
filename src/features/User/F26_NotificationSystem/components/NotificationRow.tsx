// src/features/User/F26_NotificationSystem/components/NotificationRow.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import type { NotificationItem } from '../types';
import TechnicalTimestamp from '../../../../components/shared/TechnicalTimestamp';
import { Bell, CheckCircle2, MessageSquare, ThumbsUp, Award } from 'lucide-react';

interface NotificationRowProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
}

// Helper: build human-readable message from notification type + actor
function buildMessage(notification: NotificationItem): string {
  const actorName = notification.actor?.username || 'Someone';
  switch (notification.type) {
    case 'new_comment':
    case 'new_answer':
      return `${actorName} menjawab pertanyaan Anda.`;
    case 'accepted_answer':
      return `${actorName} menerima jawaban Anda.`;
    case 'new_vote':
    case 'new_like':
      return `${actorName} memberikan vote pada postingan Anda.`;
    case 'badge_earned':
      return `Selamat! Anda mendapatkan badge baru.`;
    default:
      return `${actorName} berinteraksi dengan konten Anda.`;
  }
}

// Helper: resolve link from reference_type + reference_id
function buildLink(notification: NotificationItem): string | null {
  if (!notification.reference_id) return null;
  switch (notification.reference_type) {
    case 'post':
      return `/posts/${notification.reference_id}`;
    case 'comment':
      return `/posts/${notification.reference_id}`; // navigate to the post
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
