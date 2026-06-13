// src/features/User/F23_LikeSystem/components/LikeButton.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Loader2 } from 'lucide-react';
import { toggleLike } from '../api';
import { useAuthStore } from '../../../../store/useAuthStore';

interface LikeButtonProps {
  targetId: string;
  targetType: 'post' | 'comment';
  initialIsLiked?: boolean;
  initialLikesCount?: number;
  className?: string;
}

export default function LikeButton({
  targetId,
  targetType,
  initialIsLiked = false,
  initialLikesCount = 0,
  className = '',
}: LikeButtonProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => toggleLike({ target_id: targetId, target_type: targetType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });

  // Optimistic state
  const isLiked = mutation.isPending
    ? !initialIsLiked
    : initialIsLiked;
  const likesCount = mutation.isPending
    ? initialIsLiked ? initialLikesCount - 1 : initialLikesCount + 1
    : initialLikesCount;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    mutation.mutate();
  };

  return (
    <button
      onClick={handleClick}
      disabled={mutation.isPending || !user}
      className={`inline-flex items-center gap-1.5 text-xs transition-colors disabled:opacity-50 ${
        isLiked
          ? 'text-red-400'
          : 'text-gray-500 hover:text-red-400'
      } ${className}`}
      title={user ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
    >
      {mutation.isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
      )}
      <span>{likesCount}</span>
    </button>
  );
}
