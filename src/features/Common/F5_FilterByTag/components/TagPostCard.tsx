import { Link } from 'react-router-dom';
import { Eye, FolderOpen } from 'lucide-react';
import type { TagPost } from '../types';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';

interface TagPostCardProps {
  post: TagPost;
  index: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export default function TagPostCard({ post, index }: TagPostCardProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618] py-0 hover:border-[#D4AF37]/30 transition-colors">
      <div className="flex gap-4 p-5">
        {/* ── Left: Number + Stats Box ── */}
        <div className="flex flex-col items-center gap-3 min-w-[70px] pt-0.5">
          {/* Number */}
          <span className="text-lg font-bold text-gray-500 font-fira-code">{index}</span>

          {/* Stats box */}
          <div className="flex flex-col items-center gap-1.5 text-center w-full">
            <div className="bg-[#0B0B0C] border border-[#2A2A2C] rounded px-2 py-1 w-full">
              <span className="block text-sm font-bold text-gray-300 font-fira-code">{post.vote_score}</span>
              <span className="block text-[9px] text-gray-500 uppercase tracking-wider">votes</span>
            </div>
            <div
              className={`rounded px-2 py-1 w-full border ${
                post.is_answered
                  ? 'bg-green-950/30 border-green-900/50'
                  : 'bg-[#0B0B0C] border-[#2A2A2C]'
              }`}
            >
              <span
                className={`block text-sm font-bold font-fira-code ${
                  post.is_answered ? 'text-green-400' : 'text-gray-300'
                }`}
              >
                {post.comments_count}
              </span>
              <span className="block text-[9px] text-gray-500 uppercase tracking-wider">answers</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Eye className="w-3 h-3" />
              <span>{formatCount(post.view_count)}</span>
            </div>
          </div>
        </div>

        {/* ── Right: Content ── */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <Link to={`/posts/${post.id}`}>
            <h2 className="text-base font-semibold text-[#D4AF37] hover:text-[#c29f2f] transition-colors line-clamp-2 mb-2 cursor-pointer">
              {post.title}
            </h2>
          </Link>

          {/* Body excerpt */}
          <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {post.body}
          </p>

          {/* Tags + Category */}
          <div className="flex flex-wrap gap-1.5 mb-3 items-center">
            {post.category && (
              <Badge
                variant="outline"
                className="text-[11px] bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] font-medium gap-1"
              >
                <FolderOpen className="w-3 h-3" />
                {post.category.name}
              </Badge>
            )}
            {post.tags.slice(0, 4).map((t) => (
              <Link key={t.id} to={`/tags/${t.slug}`}>
                <Badge
                  variant="outline"
                  className="text-[11px] bg-[#1A1A1C] border-[#2A2A2C] font-medium cursor-pointer hover:bg-[#2A2A2C] transition-colors"
                  style={t.color ? { color: t.color, borderColor: `${t.color}40` } : undefined}
                >
                  {t.slug}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Author info */}
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5 border border-[#2A2A2C]">
              {post.user.avatar_url ? (
                <AvatarImage src={post.user.avatar_url} alt={post.user.username} />
              ) : null}
              <AvatarFallback className="bg-[#D4AF37] text-black text-[9px] font-bold">
                {post.user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-blue-400 font-medium">{post.user.username}</span>
            <span className="text-xs text-gray-500">{timeAgo(post.created_at)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
