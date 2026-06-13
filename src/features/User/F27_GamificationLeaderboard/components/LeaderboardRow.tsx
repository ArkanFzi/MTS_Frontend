import { Link } from 'react-router-dom';

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
      className={`flex items-center flex-nowrap gap-2 sm:gap-4 px-3 sm:px-5 py-3 border-b border-[#2A2A2C] transition-all duration-300 group ${
        rank === 1 
          ? 'border-l-2 border-l-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-transparent' 
          : rank === 2 ? 'border-l-2 border-l-zinc-500/30'
          : rank === 3 ? 'border-l-2 border-l-amber-600/20'
          : 'border-l-2 border-l-transparent'
      } ${rank % 2 === 0 ? 'bg-[#131315]/40' : 'bg-transparent'} hover:bg-[#1A1A1C]`}
    >
      {/* ── Rank: Lebar Tetap ── */}
      <div className="flex-shrink-0 w-10 sm:w-14 flex items-center justify-center">
        <span className="text-xs font-medium font-fira-code text-zinc-500">#{rank}</span>
      </div>

      {/* ── Expert: Flex-1 agar mengisi ruang sisa ── */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[100px] overflow-hidden">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border border-[#2A2A2C]">
          {entry.avatar_url ? <AvatarImage src={entry.avatar_url} className="object-cover" /> : null}
          <AvatarFallback className="bg-[#0B0B0C] text-xs text-[#D4AF37]">
            {entry.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <Link to={`/profile/${entry.id}`} className="text-sm font-semibold text-white truncate hover:text-[#D4AF37]">
            {entry.username}
          </Link>
          <span className="text-[9px] text-zinc-500 font-fira-code">Lv.{entry.level}</span>
        </div>
      </div>

      {/* ── Reputation: Lebar Tetap ── */}
      <div className="flex-shrink-0 w-[65px] sm:w-[100px] text-right">
        <span className={`block text-xs sm:text-base font-bold font-fira-code tabular-nums ${isTopThree ? 'text-[#D4AF37]' : 'text-zinc-300'}`}>
          {formatNumber(entry.reputation_points)}
        </span>
        <span className="text-[8px] sm:text-[9px] text-zinc-500 font-medium uppercase tracking-widest">REPUTATION</span>
      </div>

      {/* ── Badge: Lebar Tetap ── */}
      <div className="flex-shrink-0 w-[60px] sm:w-[120px] flex justify-end">
        <Badge variant="outline" className={`text-[9px] sm:text-[10px] h-auto px-1.5 py-0.5 sm:px-2 sm:py-1 truncate ${badge.className}`}>
          {badge.label}
        </Badge>
      </div>
    </div>
  );
}