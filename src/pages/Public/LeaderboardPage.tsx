// src/pages/LeaderboardPage.tsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "../../features/User/F27_GamificationLeaderboard/api";
import type { LeaderboardEntry } from "../../features/User/F27_GamificationLeaderboard/types";
import ResponsiveLayout from "../../components/shared/ResponsiveLayout";
import LeaderboardTable from "../../features/User/F27_GamificationLeaderboard/components/LeaderboardTable";
import LeaderboardSkeleton from "../../features/User/F27_GamificationLeaderboard/components/LeaderboardSkeleton";

export default function LeaderboardPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [allEntries, setAllEntries] = useState<LeaderboardEntry[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard", page],
    queryFn: () => getLeaderboard(page, limit),
  });

  useEffect(() => {
    if (!data?.data) return;

    // GUARD CLAUSE: Sinkronisasi paket data halaman API dengan state page aktif
    if (data.meta && data.meta.current_page !== page) return;

    const newEntries = data.data;

    setAllEntries((prev) => {
      if (page === 1) return newEntries;
      const prevCount = (page - 1) * limit;
      const base = prev.slice(0, prevCount);
      return [...base, ...newEntries];
    });
  }, [data, page]);

  const meta = data?.meta;
  const hasMore = meta ? meta.current_page < meta.last_page : false;
  const displayEntries = allEntries.length > 0 ? allEntries : (data?.data || []);

  const handleCollapse = () => {
    setPage(1);
    const anchor = document.getElementById("leaderboard-anchor");
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <ResponsiveLayout>
      <div id="leaderboard-anchor" className="w-full py-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-9">
            Top ranked experts based on reputation points.
          </p>
        </div>

        {/* ── Content Wrapper ── */}
        {isLoading && page === 1 ? (
          <LeaderboardSkeleton />
        ) : isError ? (
          <p className="text-red-400 text-center py-20">
            Failed to load leaderboard. Please try again later.
          </p>
        ) : displayEntries.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
            <p className="text-gray-500">No leaderboard data available yet.</p>
          </div>
        ) : (
          <LeaderboardTable
            entries={displayEntries}
            isLoading={isLoading}
            hasMore={hasMore}
            page={page}
            onLoadMore={() => setPage((p) => p + 1)}
            onCollapse={handleCollapse}
          />
        )}
      </div>
    </ResponsiveLayout>
  );
}