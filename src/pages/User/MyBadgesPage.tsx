// src/pages/User/MyBadgesPage.tsx
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Lock, Unlock, Award } from 'lucide-react';
import { getAllBadgesForUser } from '../../features/User/F29_BadgeAchievement/api';
import BadgeGridDisplay from '../../features/User/F29_BadgeAchievement/components/BadgeGridDisplay';
import { Skeleton } from '../../components/ui/skeleton';

export default function MyBadgesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['myBadges'],
    queryFn: getAllBadgesForUser,
  });

  const badges = data?.data || [];

  const { unlocked, locked } = useMemo(() => {
    let u = 0;
    let l = 0;
    badges.forEach((b) => (b.earned_at ? u++ : l++));
    return { unlocked: u, locked: l };
  }, [badges]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-white">Mastery Display</h1>
          </div>
          <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
            Achievements unlocked through rigorous inquiry and authoritative responses.
            Locked badges indicate thresholds not yet met.
          </p>
        </div>

        {/* Stats box */}
        {!isLoading && badges.length > 0 && (
          <div className="flex items-center bg-[#161618] border border-zinc-800 rounded-lg px-4 py-2.5 gap-4">
            <div className="flex items-center gap-2">
              <Unlock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-bold text-[#D4AF37]">{unlocked}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Unlocked</span>
            </div>
            <div className="w-px h-4 bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs font-bold text-zinc-400">{locked}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Locked</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#161618] border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-3">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-full h-5 mt-2" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
          <Award className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-red-400 text-sm">Failed to load badges. Please refresh.</p>
        </div>
      )}

      {!isLoading && !isError && <BadgeGridDisplay badges={badges} />}
    </div>
  );
}
