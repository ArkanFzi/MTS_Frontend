// src/features/User/F27_GamificationLeaderboard/components/LeaderboardTable.tsx
import { ChevronDown, ChevronUp } from "lucide-react";
import type { LeaderboardEntry } from "../types";
import LeaderboardRow from "./LeaderboardRow";
import { Button } from "../../../../components/ui/button";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  onLoadMore: () => void;
  onCollapse: () => void;
  className?: string;
}

export default function LeaderboardTable({
  entries,
  isLoading,
  hasMore,
  page,
  onLoadMore,
  onCollapse,
  className = "",
}: LeaderboardTableProps) {
  return (
    <div className={`w-full ${className}`}>
      {/* ── Table Header ── */}
      <div className="flex items-center flex-nowrap gap-2 mb-5 sm:gap-4 px-3 sm:px-5 py-3 border-b border-[#2A2A2C] text-[9px] font-bold text-gray-500 uppercase">
        <div className="shrink-0 w-10 sm:w-14 text-center">Rank</div>
        <div className="flex-1 min-w-25">Expert</div>
        <div className="shrink-0 w-[65px] sm:w-[100px] text-right">Reputation</div>
        <div className="shrink-0 w-[60px] sm:w-[120px] flex justify-end">Badge</div>
      </div>

      {/* ── Rows Container ── */}
      <div className="border border-[#2A2A2C] rounded-lg overflow-hidden bg-[#161618]">
        {entries.map((entry, index) => (
          <LeaderboardRow key={entry.id} entry={entry} rank={index + 1} />
        ))}
      </div>

      {/* ── Loading Tambahan (Page > 1) ── */}
      {isLoading && page > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            Loading more...
          </div>
        </div>
      )}

      {/* ── Action Buttons (Load More & Tutup) ── */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {/* Tombol Tutup: Muncul jika sudah melangkah ke page 2 atau lebih */}
        {page > 1 && (
          <Button
            variant="ghost"
            className="text-zinc-500 hover:text-white hover:bg-[#1C1C1E] px-6 rounded-full transition-colors duration-200 gap-1.5"
            onClick={onCollapse}
          >
            <ChevronUp className="w-4 h-4" />
            Tutup
          </Button>
        )}

        {/* Tombol Load More */}
        {!isLoading && hasMore && (
          <Button
            variant="outline"
            className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 gap-2 rounded-full"
            onClick={onLoadMore}
          >
            Load More
            <ChevronDown className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}