// src/features/User/F22_VoteSystem/components/VoteControl.tsx
import { useState, useEffect } from 'react';
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
  direction?: 'vertical' | 'horizontal'; // Prop baru untuk mengatur layout
}

export default function VoteControl({
  targetId,
  targetType,
  initialScore,
  userVote = null,
  className = '',
  direction = 'vertical',
}: VoteControlProps) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Gunakan local state agar tidak flicker saat invalidation berjalan
  const [displayScore, setDisplayScore] = useState(initialScore);
  const [activeVote, setActiveVote] = useState(userVote);

  // Sinkronisasi dengan data server terbaru jika berubah
  useEffect(() => {
    setDisplayScore(initialScore);
    setActiveVote(userVote);
  }, [initialScore, userVote]);

  const mutation = useMutation({
    mutationFn: (type: 'up' | 'down') =>
      vote({ target_id: targetId, target_type: targetType, type }),
    onMutate: async (type) => {
      // Optimistic update ke local state SECARA LANGSUNG
      let newScore = displayScore;
      if (activeVote === type) {
        // Batal vote
        newScore += type === 'up' ? -1 : 1;
        setActiveVote(null);
      } else {
        // Ganti vote atau vote baru
        newScore += (type === 'up' ? 1 : -1) + (activeVote ? (activeVote === 'up' ? -1 : 1) : 0);
        setActiveVote(type);
      }
      setDisplayScore(newScore);
    },
    onError: () => {
      // Rollback jika API gagal
      setDisplayScore(initialScore);
      setActiveVote(userVote);
    },
    onSettled: () => {
      // Refetch data di background tanpa mengganggu UI
      queryClient.invalidateQueries({ queryKey: ['post'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['my-posts'] });
    },
  });

  const handleVote = (type: 'up' | 'down') => {
    if (!user || mutation.isPending) return;
    mutation.mutate(type);
  };

  // Tentukan class berdasarkan direction
  const layoutClass = direction === 'horizontal' ? 'flex-row items-center gap-2' : 'flex-col items-center gap-1';

  return (
    <div className={`flex ${layoutClass} ${className}`}>
      <button
        onClick={(e) => { e.preventDefault(); handleVote('up'); }} // preventDefault agar tidak memicu Link pembungkus di Card
        disabled={mutation.isPending || !user}
        className={`flex items-center justify-center rounded-md transition-colors ${
          direction === 'horizontal' ? 'w-6 h-6' : 'w-8 h-8'
        } ${
          activeVote === 'up'
            ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
            : 'text-gray-400 hover:bg-[#2A2A2C] hover:text-[#D4AF37]'
        } disabled:opacity-40`}
        title={user ? 'Upvote' : 'Login to vote'}
      >
        <ArrowUp className={direction === 'horizontal' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>

      <span className={`${direction === 'horizontal' ? 'text-xs' : 'text-lg'} font-bold text-[#D4AF37] font-fira-code tabular-nums`}>
        {displayScore} {direction === 'horizontal' && 'pts'}
      </span>

      <button
        onClick={(e) => { e.preventDefault(); handleVote('down'); }}
        disabled={mutation.isPending || !user}
        className={`flex items-center justify-center rounded-md transition-colors ${
           direction === 'horizontal' ? 'w-6 h-6' : 'w-8 h-8'
        } ${
          activeVote === 'down'
            ? 'bg-red-500/20 text-red-400'
            : 'text-gray-400 hover:bg-[#2A2A2C] hover:text-gray-200'
        } disabled:opacity-40`}
        title={user ? 'Downvote' : 'Login to vote'}
      >
        <ArrowDown className={direction === 'horizontal' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </button>
    </div>
  );
}