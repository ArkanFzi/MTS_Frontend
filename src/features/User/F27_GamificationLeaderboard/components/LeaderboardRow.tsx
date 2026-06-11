import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import type { LeaderboardEntry } from '../types';
import { getBadgeTier, badgeTierConfig } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export default function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  const tier = getBadgeTier(entry.reputation_points);
  const badge = badgeTierConfig[tier];
  const isTopThree = rank <= 3;

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 border-b border-[#2A2A2C] transition-colors hover:bg-[#1A1A1C] ${
        rank === 1 ? 'border-l-2 border-l-[#D4AF37]' : 'border-l-2 border-l-transparent'
      } ${rank % 2 === 0 ? 'bg-[#131315]' : ''}`}
    >
      {/* ── Rank ── */}
      <div className="flex-shrink-0 w-12 text-center">
        {rank === 1 ? (
          <div className="flex items-center justify-center gap-1">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-lg font-black text-[#D4AF37] font-fira-code">#{rank}</span>
          </div>
        ) : (
          <span className={`text-lg font-bold font-fira-code ${isTopThree ? 'text-[#D4AF37]/80' : 'text-gray-500'}`}>
            #{rank}
          </span>
        )}
      </div>

      {/* ── Expert (Avatar + Username) ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border border-[#2A2A2C]">
          {entry.avatar_url ? (
            <AvatarImage src={entry.avatar_url} alt={entry.username} />
          ) : null}
          <AvatarFallback className="bg-[#0B0B0C] text-sm text-[#D4AF37] font-bold">
            {entry.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Link
          to={`/profile/${entry.id}`}
          className="text-sm font-semibold text-white hover:text-[#D4AF37] transition-colors truncate"
        >
          {entry.username}
        </Link>
        <span className="text-[10px] text-gray-600 font-medium">Lv.{entry.level}</span>
      </div>

      {/* ── Reputation ── */}
      <div className="flex-shrink-0 text-right min-w-[100px]">
        <span className="text-base font-bold text-[#D4AF37] font-fira-code tabular-nums">
          {formatNumber(entry.reputation_points)}
        </span>
        <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Reputation</span>
      </div>

      {/* ── Badge ── */}
      <div className="flex-shrink-0 min-w-[120px] flex justify-end">
        <Badge
          variant="outline"
          className={`text-[11px] px-3 py-1 h-auto font-semibold border ${badge.className}`}
        >
          {rank === 1 && <Crown className="w-3 h-3 mr-1" />}
          {badge.label}
        </Badge>
      </div>
    </div>
  );
}
