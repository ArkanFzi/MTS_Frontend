// src/features/User/F22_VoteSystem/components/VoteControl.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { vote } from '../api';
import { useAuthStore } from '../../../../store/useAuthStore';

interface VoteControlProps {
  targetId: string;
  targetType: 'post' | 'comment';
  initialScore: number;
  userVote?: 'up' | 'down' | null;
  className?: string;
}

export default function VoteControl({
  targetId,
  targetType,
  initialScore,
  userVote = null,
  className = '',
}: VoteControlProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (type: 'up' | 'down') =>
      vote({ target_id: targetId, target_type: targetType, type }),
    onSuccess: () => {
      // Invalidate relevant queries so score updates
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const optimisticScore =
    mutation.isPending && mutation.variables
      ? // Optimistic: if user clicked up and was already up, cancel → score-1; else score+1
        mutation.variables === userVote
          ? initialScore + (mutation.variables === 'up' ? -1 : 1)
          : initialScore + (mutation.variables === 'up' ? 1 : -1) + (userVote ? (userVote === 'up' ? -1 : 1) : 0)
      : initialScore;

  const activeVote = userVote;

  const handleVote = (type: 'up' | 'down') => {
    if (!user) return;
    mutation.mutate(type);
  };

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <button
        onClick={() => handleVote('up')}
        disabled={mutation.isPending || !user}
        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
          activeVote === 'up'
            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
            : 'text-gray-400 hover:bg-[#2A2A2C] hover:text-[#D4AF37]'
        } disabled:opacity-40`}
        title={user ? 'Upvote' : 'Login to vote'}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      <span className="text-lg font-bold text-[#D4AF37] font-fira-code tabular-nums">
        {mutation.isPending ? optimisticScore : initialScore}
      </span>

      <button
        onClick={() => handleVote('down')}
        disabled={mutation.isPending || !user}
        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
          activeVote === 'down'
            ? 'bg-red-500/20 text-red-400'
            : 'text-gray-400 hover:bg-[#2A2A2C] hover:text-gray-200'
        } disabled:opacity-40`}
        title={user ? 'Downvote' : 'Login to vote'}
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
}
