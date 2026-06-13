// src/features/User/F24_BookmarkPost/components/BookmarkCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import BookmarkToggle from './BookmarkToggle';
import type { BookmarkCardProps } from '../types';

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
      className="flex items-start justify-between p-5 transition-all hover:bg-zinc-900/40 cursor-pointer group border-b border-zinc-900/50"
    >
      <div className="space-y-2 flex-1 min-w-0">
        {/* Info Pembuat Postingan */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <User className="h-2.5 w-2.5 text-zinc-400" />
          </div>
          <span className="truncate">
            Disimpan dari{' '}
            <span 
              onClick={handleAuthorClick}
              className="text-zinc-300 font-bold hover:underline cursor-pointer relative z-10"
            >
              @{item.post?.user?.username || 'user'}
            </span>
          </span>
        </div>

        {/* Judul Postingan Asli */}
        <h2 className="text-base font-semibold text-zinc-200 group-hover:text-[#D4AF37] transition-colors tracking-tight line-clamp-1">
          {item.post?.title}
        </h2>

        {/* Catatan (Jika ada) */}
        {item.notes && (
          <div className="mt-2 p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs text-zinc-400 italic">
            <span className="font-bold text-zinc-500 not-italic block text-[10px] uppercase tracking-wider mb-0.5">
              Catatan Lu:
            </span>
            "{item.notes}"
          </div>
        )}
      </div>

      {/* Aksi Lepas/Hapus Bookmark */}
      <div 
        className="ml-6 flex-shrink-0"
        onClick={(e) => e.stopPropagation()} 
      >
        <BookmarkToggle postId={item.post_id} isInitiallyBookmarked={true} />
      </div>
    </div>
  );
}