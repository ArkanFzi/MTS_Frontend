// src/features/User/F26_NotificationSystem/components/NotificationRow.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';
import type { NotificationItem } from '../types';
import { Bell, CheckCircle2, MessageSquare, ThumbsUp, Award } from 'lucide-react';
import TechnicalTimestamp from '../../../../components/shared/TechnicalTimestamp';

interface NotificationRowProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
}

export const NotificationRow: React.FC<NotificationRowProps> = ({ notification, onMarkRead }) => {
  const navigate = useNavigate();
  const { id, read_at, created_at, type, data } = notification;

  const isUnread = read_at === null;

  const handleNotificationClick = () => {
    if (isUnread) {
      onMarkRead(id);
    }
    if (data.link) {
      navigate(data.link);
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'App\\Notifications\\NewCommentOrAnswer':
        return <MessageSquare className="h-4 w-4 text-lime-500" />;
      case 'App\\Notifications\\PostAcceptedAnswer':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'App\\Notifications\\NewVoteOrLike':
        return <ThumbsUp className="h-4 w-4 text-amber-500" />;
      case 'App\\Notifications\\BadgeEarned':
        return <Award className="h-4 w-4 text-[#D4AF37]" />;
      default:
        return <Bell className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div
      onClick={handleNotificationClick}
      className={`flex items-start gap-4 p-4 border-b border-zinc-800 transition-all cursor-pointer hover:bg-zinc-900/60 ${
        isUnread ? 'bg-[#161618] border-l-2 border-l-[#D4AF37]' : ''
      }`}
    >
      {/* Diperbaiki: Hanya memakai shrink-0 untuk melumpuhkan linter CSS conflict */}
      <div className="relative shrink-0"> 
        <Avatar className="h-10 w-10 border border-zinc-700">
          {data.actor?.avatar_url ? (
            <AvatarImage src={data.actor.avatar_url} alt={data.actor.username} />
          ) : (
            <AvatarFallback className="bg-zinc-800 text-zinc-400 font-semibold">
              {data.actor?.username ? data.actor.username.substring(0, 2).toUpperCase() : 'SYS'}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="absolute -bottom-1 -right-1 p-1 bg-zinc-950 rounded-full border border-zinc-800">
          {renderIcon()}
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <div className="text-sm text-zinc-200">
          {data.actor && (
            <span className="font-bold text-zinc-100 mr-1 hover:underline">
              {data.actor.username}
            </span>
          )}
          {data.message}
        </div>
        <div className="text-xs">
          <TechnicalTimestamp timestamp={created_at} />
        </div>
      </div>

      {isUnread && (
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

export default TechnicalTimestamp;