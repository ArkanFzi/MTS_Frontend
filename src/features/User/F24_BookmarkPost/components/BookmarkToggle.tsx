// src/features/User/F24_BookmarkPost/components/BookmarkToggle.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmark } from '../api';
import { Bookmark, Loader2 } from 'lucide-react';

interface BookmarkToggleProps {
  postId: string;
  isInitiallyBookmarked?: boolean;
}

export default function BookmarkToggle({ postId, isInitiallyBookmarked = false }: BookmarkToggleProps) {
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);

  const mutation = useMutation({
    mutationFn: () => toggleBookmark(postId),
    onSuccess: (data) => {
      const newStatus = data.status === 'bookmarked';
      setIsBookmarked(newStatus);
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
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
    <button
      onClick={handleToggle}
      disabled={mutation.isPending}
      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#D4AF37] transition-colors px-1 py-1 rounded hover:bg-[#1A1A1C] disabled:opacity-50"
      title={isBookmarked ? 'Hapus dari simpanan' : 'Simpan postingan'}
    >
      {mutation.isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Bookmark 
          className={`h-3.5 w-3.5 transition-colors ${
            isBookmarked ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-500'
          }`} 
        />
      )}
    </button>
  );
}