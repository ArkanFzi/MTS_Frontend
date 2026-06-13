// src/features/User/F24_BookmarkPost/components/BookmarkCard.tsx
import { User } from 'lucide-react';
import BookmarkToggle from './BookmarkToggle';

interface BookmarkCardProps {
  item: any;
}

export default function BookmarkCard({ item }: BookmarkCardProps) {
  return (
    <div className="flex items-start justify-between p-5 transition-all hover:bg-zinc-900/40">
      <div className="space-y-2 flex-1">
        {/* Info Pembuat Postingan */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <div className="h-4 w-4 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <User className="h-2.5 w-2.5 text-zinc-400" />
          </div>
          <span>
            Disimpan dari <span className="text-zinc-300 font-bold hover:underline cursor-pointer">@{item.post?.user?.username || 'suhu'}</span>
          </span>
        </div>

        {/* Judul Postingan Asli */}
        <h2 className="text-base font-semibold text-zinc-200 hover:text-[#D4AF37] cursor-pointer transition-colors tracking-tight line-clamp-1">
          {item.post?.title}
        </h2>

        {/* Cuplikan Konten */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {item.post?.excerpt}
        </p>
      </div>

      {/* Aksi Lepas/Hapus Bookmark */}
      <div className="ml-6 flex-shrink-0">
        <BookmarkToggle postId={item.post_id} isInitiallyBookmarked={true} />
      </div>
    </div>
  );
}
