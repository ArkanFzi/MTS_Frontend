// src/features/User/F24_BookmarkPost/components/BookmarkToggle.tsx
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmark } from '../api';
import { Bookmark, Loader2 } from 'lucide-react';

interface BookmarkToggleProps {
  postId: string;
  isInitiallyBookmarked?: boolean;
}

export default function BookmarkToggle({ postId, isInitiallyBookmarked = false }: BookmarkToggleProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => toggleBookmark(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (err) => {
      console.error('Failed to toggle bookmark:', err);
    },
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    mutation.mutate();
  };

  return (
    <div className="relative inline-block font-['Inter']">
      <button
        onClick={handleToggle}
        disabled={mutation.isPending}
        className={`flex items-center justify-center p-2.5 border transition-all active:translate-x-p active:translate-y-px disabled:opacity-50 ${
          isInitiallyBookmarked
            ? 'bg-[#0B0B0C] border-[#2A2A2C] text-[#D4AF37] hover:bg-red-950/30 hover:text-red-400 hover:border-red-900'
            : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-[#D4AF37] hover:border-zinc-700'
        }`}
        title={isInitiallyBookmarked ? 'Hapus dari simpanan' : 'Simpan postingan'}
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark className={`h-4 w-4 ${isInitiallyBookmarked ? 'fill-[#D4AF37]' : ''}`} />
        )}
      </button>
    </div>
  );
}