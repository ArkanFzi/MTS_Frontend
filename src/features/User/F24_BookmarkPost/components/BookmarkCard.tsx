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

  // Handler khusus klik username (Mengebiri bubbling agar card tidak ikut ter-klik)
  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.post?.user?.id) {
      // Mengarah ke profil publik berdasarkan ID pembuat post
      navigate(`/profile/${item.post.user.id}`);
      
      // Catatan: Jika route profil publikmu menggunakan username, ganti menjadi:
      // navigate(`/profile/${item.post.user.username}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="flex items-start justify-between p-5 transition-all hover:bg-zinc-900/40 cursor-pointer group"
    >
      <div className="space-y-2 flex-1">
        {/* Info Pembuat Postingan */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <User className="h-2.5 w-2.5 text-zinc-400" />
          </div>
          <span>
            Disimpan dari{' '}
            <span 
              onClick={handleAuthorClick}
              className="text-zinc-300 font-bold hover:underline cursor-pointer relative z-10"
            >
              @{item.post?.user?.username || 'suhu'}
            </span>
          </span>
        </div>

        {/* Judul Postingan Asli */}
        <h2 className="text-base font-semibold text-zinc-200 group-hover:text-[#D4AF37] transition-colors tracking-tight line-clamp-1">
          {item.post?.title}
        </h2>

        {/* Cuplikan Konten */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {item.post?.excerpt}
        </p>
      </div>

      {/* Aksi Lepas/Hapus Bookmark */}
      <div 
        className="ml-6 flex-shrink-0"
        onClick={(e) => e.stopPropagation()} // 🌟 Mencegah card utama ter-klik saat unbookmark
      >
        <BookmarkToggle postId={item.post_id} isInitiallyBookmarked={true} />
      </div>
    </div>
  );
}