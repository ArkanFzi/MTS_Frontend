import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, ChevronDown } from 'lucide-react';
import { getLeaderboard } from '../../features/User/F27_GamificationLeaderboard/api';
import type { LeaderboardEntry } from '../../features/User/F27_GamificationLeaderboard/types';
import LeaderboardRow from '../../features/User/F27_GamificationLeaderboard/components/LeaderboardRow';
import { Button } from '../../components/ui/button';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

import LeaderboardSkeleton from '../../features/User/F27_GamificationLeaderboard/components/LeaderboardSkeleton';

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard', page],
    queryFn: () => getLeaderboard(page, limit),
  });

  useEffect(() => {
    if (!data?.data) return;
    const newEntries = data.data;

    setAllEntries((prev) => {
      if (page === 1) return newEntries;
      const prevCount = (page - 1) * limit;
      const base = prev.slice(0, prevCount);
      return [...base, ...newEntries];
    });
  }, [data, page]);

  const entries = data?.data || [];
  const meta = data?.meta;
  const hasMore = meta ? meta.current_page < meta.last_page : false;
  const displayEntries = page === 1 ? entries : allEntries;

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Leaderboard</h1>
          </div>
          <p className="text-sm text-gray-400 ml-9">
            Top ranked experts based on reputation points.
          </p>
        </div>

        {/* ── Table Header (Sinkron dengan LeaderboardRow) ── */}
        <div className="flex items-center flex-nowrap gap-2 mb-5 sm:gap-4 px-3 sm:px-5 py-3 border-b border-[#2A2A2C] text-[9px] font-bold text-gray-500 uppercase mb-0">
          <div className="flex-shrink-0 w-10 sm:w-14 text-center">Rank</div>
          <div className="flex-1 min-w-[100px]">Expert</div>
          <div className="flex-shrink-0 w-[65px] sm:w-[100px] text-right">Rep</div>
          <div className="flex-shrink-0 w-[60px] sm:w-[120px] text-right">Badge</div>
        </div>

        {/* ── Content ── */}
        {isLoading && page === 1 && <LeaderboardSkeleton />}

        {!isLoading && isError && (
          <p className="text-red-400 text-center py-20">
            Failed to load leaderboard. Please try again later.
          </p>
        )}

        {!isLoading && !isError && entries.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
            <p className="text-gray-500">No leaderboard data available yet.</p>
          </div>
        )}

        {!isError && displayEntries.length > 0 && (
          <div className="border border-[#2A2A2C] rounded-lg overflow-hidden bg-[#161618]">
            {displayEntries.map((entry, index) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                rank={index + 1}
              />
            ))}
          </div>
        )}

        {/* ── Load More ── */}
        {hasMore && !isLoading && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 gap-2 rounded-full"
              onClick={() => setPage((p) => p + 1)}
            >
              Load More
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {isLoading && page > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              Loading more...
            </div>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}