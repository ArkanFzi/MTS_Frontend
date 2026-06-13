// src/features/User/F24_BookmarkPost/components/BookmarkCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CornerDownRight } from 'lucide-react';
import BookmarkToggle from './BookmarkToggle';
import type { BookmarkCardProps } from '../types';
import { Badge } from '../../../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';

// Function formatCount untuk mengubah angka menjadi format ribuan atau jutaan
function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

// Function timeAgo untuk mengubah tanggal menjadi format waktu yang lalu
function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function BookmarkCard({ item }: BookmarkCardProps) {
  const navigate = useNavigate();

  // Handler untuk mengarah ke detail pertanyaan/post
  const handleCardClick = () => {
    if (item.post_id) {
      navigate(`/posts/${item.post_id}`);
    }
  };

  // Handler khusus klik username (mencegah bubbling ke card)
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.post?.user?.id) {
      navigate(`/profile/${item.post.user.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-4 sm:p-5 rounded-xl border border-[#2A2A2C] bg-[#161618] hover:border-[#D4AF37]/40 transition-all duration-200 group cursor-pointer w-full"
    >
      {/* ── Badges + Content ── */}
      <div className="flex-1 min-w-0 w-full">
        {/* Tag row */}
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className="bg-[#1A1A1C] text-[10px] px-2 py-0.5 h-auto border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 rounded-full font-medium whitespace-nowrap transition-colors"
          >
            {item.post?.category?.name || 'Uncategorized'}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2 leading-snug">
          {item.post?.title}
        </h3>

        {/* Author + time */}
        <div className="flex items-center gap-2">
          <Avatar 
            onClick={handleAuthorClick}
            className="h-5 w-5 border border-[#2A2A2C] hover:border-[#D4AF37]/60 transition-colors relative z-10"
          >
            {item.post?.user?.avatar_url ? (
              <AvatarImage src={item.post.user.avatar_url} alt={item.post.user.username} />
            ) : null}
            <AvatarFallback className="bg-[#0B0B0C] text-[9px] text-[#D4AF37] font-bold">
              {item.post?.user?.username?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-400 truncate">
            <span 
              onClick={handleAuthorClick}
              className="text-gray-300 font-medium hover:text-[#D4AF37] hover:underline relative z-10"
            >
              {item.post?.user?.username || 'user'}
            </span>
            <span className="mx-1.5 text-gray-600">•</span>
            Disimpan {item.created_at ? timeAgo(item.created_at) : ''}
          </span>
        </div>

        {/* Catatan User (Jika ada) */}
        {item.notes && (
          <div className="mt-3 p-3 bg-[#0B0B0C] rounded-lg text-xs text-zinc-400">
            <span className="flex items-center gap-1 font-bold text-zinc-500 text-[10px] uppercase tracking-wider mb-1">
              <CornerDownRight className="w-3 h-3 text-zinc-500" />
              Catatan Kamu
            </span>
            <p className="italic break-words text-zinc-300">"{item.notes}"</p>
          </div>
        )}
      </div>

      {/* ── Metric Box + Action Row ── */}
      <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 flex-shrink-0 mt-3 sm:mt-0">
        {/* Views Metric */}
        <div className="flex items-center gap-2 bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg px-3 py-2 min-w-[90px]">
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-gray-300 font-fira-code leading-none">
              {formatCount(item.post?.view_count || 0)}
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">
              Views
            </span>
          </div>
        </div>

        {/* Bookmark Toggle Action Button */}
        <div 
          className="flex-shrink-0 relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <BookmarkToggle postId={item.post_id} isInitiallyBookmarked={true} />
        </div>
      </div>
    </div>
  );
}