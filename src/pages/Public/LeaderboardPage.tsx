import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, ChevronDown } from 'lucide-react';
import { getLeaderboard } from '../../features/User/F27_GamificationLeaderboard/api';
import type { LeaderboardEntry } from '../../features/User/F27_GamificationLeaderboard/types';
import LeaderboardRow from '../../features/User/F27_GamificationLeaderboard/components/LeaderboardRow';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';

function LeaderboardSkeleton() {
  return (
    <div className="border border-[#2A2A2C] rounded-xl overflow-hidden bg-[#161618]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#2A2A2C]">
          <Skeleton className="w-12 h-6" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-32 h-4" />
          </div>
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leaderboard', page],
    queryFn: () => getLeaderboard(page, limit),
  });

  const entries = data?.data || [];
  const meta = data?.meta;
  const hasMore = meta ? meta.current_page < meta.last_page : false;

  // Accumulate entries across pages for "Load More" pattern
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);

  // When data changes, accumulate
  if (data?.data) {
    if (page === 1) {
      if (allEntries.length !== data.data.length || JSON.stringify(allEntries) !== JSON.stringify(data.data)) {
        setAllEntries(data.data);
      }
    } else {
      const combined = [...allEntries.slice(0, (page - 1) * limit), ...data.data];
      if (combined.length !== allEntries.length) {
        setAllEntries(combined);
      }
    }
  }

  const displayEntries = page === 1 ? entries : allEntries;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 font-['Inter']">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-7 h-7 text-[#D4AF37]" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Leaderboard</h1>
        </div>
        <p className="text-sm text-gray-400 ml-10">
          Top ranked experts based on reputation points.
        </p>
      </div>

      {/* ── Table Header ── */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-[#2A2A2C] text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0">
        <div className="w-12 text-center">Rank</div>
        <div className="flex-1">Expert</div>
        <div className="min-w-[100px] text-right">Reputation</div>
        <div className="min-w-[120px] text-right">Badge</div>
      </div>

      {/* ── Content ── */}
      {isLoading && page === 1 && <LeaderboardSkeleton />}

      {isError && (
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
        <div className="border border-[#2A2A2C] rounded-xl overflow-hidden bg-[#161618]">
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
            className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 gap-2"
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
  );
}
