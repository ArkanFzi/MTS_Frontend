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
      className={`flex items-center gap-4 px-5 py-4 border-b border-[#2A2A2C] transition-all duration-300 group ${
        rank === 1 
          ? 'border-l-2 border-l-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/5 via-transparent to-transparent' 
          : rank === 2
          ? 'border-l-2 border-l-zinc-500/30'
          : rank === 3
          ? 'border-l-2 border-l-amber-600/20'
          : 'border-l-2 border-l-transparent'
      } ${rank % 2 === 0 ? 'bg-[#131315]/40' : 'bg-transparent'} hover:bg-[#1A1A1C]`}
    >
      {/* ── Rank ── */}
      <div className="flex-shrink-0 w-14 flex items-center justify-center">
        {rank === 1 ? (
          <div className="flex items-center justify-center gap-1 bg-[#D4AF37]/10 px-2.5 py-1 rounded-lg border border-[#D4AF37]/20 shadow-[0_0_12px_rgba(212,175,55,0.15)]">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-xs font-black text-[#D4AF37] font-fira-code">#1</span>
          </div>
        ) : rank === 2 ? (
          <div className="flex items-center justify-center bg-zinc-400/10 px-2.5 py-1 rounded-lg border border-zinc-400/20">
            <span className="text-xs font-bold text-zinc-300 font-fira-code">#2</span>
          </div>
        ) : rank === 3 ? (
          <div className="flex items-center justify-center bg-amber-700/10 px-2.5 py-1 rounded-lg border border-amber-700/20">
            <span className="text-xs font-bold text-amber-500 font-fira-code">#3</span>
          </div>
        ) : (
          <span className="text-sm font-medium font-fira-code text-zinc-500 group-hover:text-zinc-400 transition-colors">
            #{rank}
          </span>
        )}
      </div>

      {/* ── Expert (Avatar + Username) ── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-[#2A2A2C] group-hover:border-[#D4AF37]/40 transition-colors duration-300 shadow-inner">
            {entry.avatar_url ? (
              <AvatarImage src={entry.avatar_url} alt={entry.username} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-[#0B0B0C] text-sm text-[#D4AF37] font-bold">
              {entry.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {rank === 1 && (
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#D4AF37] rounded-full border-2 border-[#131315]" />
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 min-w-0">
          <Link
            to={`/profile/${entry.id}`}
            className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors truncate"
          >
            {entry.username}
          </Link>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#0B0B0C] border border-[#2A2A2C] text-[10px] text-zinc-500 font-medium font-fira-code w-max">
            Lv.{entry.level}
          </span>
        </div>
      </div>

      {/* ── Reputation ── */}
      <div className="flex-shrink-0 text-right min-w-[100px]">
        <span className={`text-base font-bold font-fira-code tabular-nums transition-colors ${isTopThree ? 'text-[#D4AF37]' : 'text-zinc-300 group-hover:text-white'}`}>
          {formatNumber(entry.reputation_points)}
        </span>
        <span className="block text-[9px] text-zinc-500 font-medium uppercase tracking-widest mt-0.5">
          Reputation
        </span>
      </div>

      {/* ── Badge ── */}
      <div className="flex-shrink-0 min-w-[120px] flex justify-end">
        <Badge
          variant="outline"
          className={`text-[10px] tracking-wide px-2.5 py-1 h-auto font-semibold border rounded-md transition-all duration-300 group-hover:brightness-110 ${badge.className}`}
        >
          {rank === 1 && <Crown className="w-3 h-3 mr-1 text-[#D4AF37]" />}
          {badge.label}
        </Badge>
      </div>
    </div>
  );
}