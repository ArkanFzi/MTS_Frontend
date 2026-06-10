import { Link } from 'react-router-dom';
import { ArrowUp, Eye, Flame } from 'lucide-react';
import type { TrendingPost } from '../types';
import { Badge } from '../../../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';

interface TrendingPostCardProps {
  post: TrendingPost;
  rank: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(n);
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function TrendingPostCard({ post, rank }: TrendingPostCardProps) {
  const isHot = rank <= 3;
  const rankColor = isHot ? 'text-[#D4AF37]' : 'text-gray-500';

  return (
    <Link
      to={`/posts/${post.id}`}
      className="flex items-center gap-5 p-5 rounded-xl border border-[#2A2A2C] bg-[#161618] hover:border-[#D4AF37]/40 transition-all duration-200 group"
    >
      {/* ── Rank number ── */}
      <div className={`flex-shrink-0 w-10 text-center font-fira-code text-3xl font-black leading-none ${rankColor}`}>
        {rank}
      </div>

      {/* ── Badges + Content ── */}
      <div className="flex-1 min-w-0">
        {/* Tag row */}
        <div className="flex items-center gap-2 mb-2">
          {isHot && (
            <Badge className="bg-red-950/60 text-red-400 border border-red-900/60 text-[10px] gap-1 px-2 py-0 h-auto">
              <Flame className="w-2.5 h-2.5" />
              Hot
            </Badge>
          )}
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0 h-auto border-[#2A2A2C] text-gray-400 font-medium"
          >
            {post.category?.name}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-2">
          {post.title}
        </h3>

        {/* Author + time */}
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5 border border-[#2A2A2C]">
            {post.user?.avatar_url ? (
              <AvatarImage src={post.user.avatar_url} alt={post.user.username} />
            ) : null}
            <AvatarFallback className="bg-[#0B0B0C] text-[9px] text-[#D4AF37] font-bold">
              {post.user?.username?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-400">
            <span className="text-gray-300 font-medium">{post.user?.username}</span>
            <span className="mx-1.5 text-gray-600">•</span>
            {timeAgo(post.created_at)}
          </span>
        </div>
      </div>

      {/* ── Metric boxes ── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Votes */}
        <div className="flex items-center gap-2 bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg px-3 py-2 min-w-[90px]">
          <ArrowUp className="w-3.5 h-3.5 text-[#D4AF37]" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#D4AF37] font-fira-code leading-none">
              {formatCount(post.vote_score)}
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">
              Votes
            </span>
          </div>
        </div>

        {/* Views */}
        <div className="flex items-center gap-2 bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg px-3 py-2 min-w-[90px]">
          <Eye className="w-3.5 h-3.5 text-gray-500" />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-300 font-fira-code leading-none">
              {formatCount(post.view_count)}
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider font-medium">
              Views
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
