// src/features/Common/F5_FilterByTag/components/TagPostCard.tsx

import { Eye, Calendar, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TagPost } from '../types';
import { Badge } from '../../../../components/ui/badge';

interface TagPostCardProps {
  post: TagPost;
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

export default function TagPostCard({ post }: TagPostCardProps) {
  return (
    <div className="bg-[#161618] border border-[#2A2A2C] hover:border-[#D4AF37]/40 transition-all duration-200 rounded-xl p-5 flex gap-4">
      {/* Left Counter Column */}
      <div className="flex flex-col items-center justify-start gap-3 min-w-[50px] pt-1">
        <div className="text-center">
          <span className="block text-lg font-bold text-[#D4AF37] font-fira-code">{post.vote_score}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-inter">Votes</span>
        </div>
        <div className="text-center">
          <span className="block text-sm font-semibold text-zinc-300 font-fira-code">{post.comments_count || 0}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-inter">Replies</span>
        </div>
      </div>

      {/* Main Content Column */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-300 font-inter">{post.user.username}</span>
          <span>•</span>
          <div className="flex items-center gap-1 font-fira-code text-[11px]">
            <Calendar className="w-3 h-3" />
            {new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </div>
        </div>

        {/* Tags + Category */}
        <div className="flex flex-wrap gap-1.5 mb-1 items-center">
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

        <Link to={`/posts/${post.id}`} className="block group">
          <h2 className="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors font-inter">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-zinc-400 font-inter line-clamp-2">
          {post.body}
        </p>
      </div>

      {/* View Count - Top Right */}
      <div className="flex items-start text-zinc-500 gap-1 text-xs font-fira-code pt-1">
        <Eye className="w-3.5 h-3.5" />
        <span>{post.view_count}</span>
      </div>
    </div>
  );
}
