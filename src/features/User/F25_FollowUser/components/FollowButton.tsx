// src/features/User/F25_FollowUser/components/FollowButton.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { toggleFollow } from '../api';
import { useAuthStore } from '../../../../store/useAuthStore';
import { Button } from '../../../../components/ui/button';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  initialFollowersCount?: number;
  className?: string;
}

export default function FollowButton({
  userId,
  initialIsFollowing = false,
  initialFollowersCount = 0,
  className = '',
}: FollowButtonProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => toggleFollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
    },
  });

  // Optimistic state
  const isFollowing = mutation.isPending ? !initialIsFollowing : initialIsFollowing;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    mutation.mutate();
  };

  // Don't show follow button for own profile
  if (user?.id === userId) return null;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleClick}
        disabled={mutation.isPending || !user}
        variant={isFollowing ? 'outline' : 'default'}
        size="sm"
        className={
          isFollowing
            ? 'border-[#2A2A2C] text-gray-300 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900 bg-transparent'
            : 'bg-[#D4AF37] text-black hover:bg-[#c29f2f]'
        }
      >
        {mutation.isPending ? (
          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
        ) : isFollowing ? (
          <UserMinus className="w-3.5 h-3.5 mr-1.5" />
        ) : (
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
        )}
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
      <span className="text-xs text-gray-500">
        {mutation.isPending
          ? isFollowing
            ? initialFollowersCount - 1
            : initialFollowersCount + 1
          : initialFollowersCount}{' '}
        followers
      </span>
    </div>
  );
}
