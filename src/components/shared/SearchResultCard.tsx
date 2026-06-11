// src/components/shared/SearchResultCard.tsx

import { Link } from 'react-router-dom';
import { MessageSquare, Eye, ArrowUp, ArrowDown } from 'lucide-react';

import type { SearchResultItem } from '../../features/Common/F4_SearchPost/types';
import { Card } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface SearchResultCardProps {
  post: SearchResultItem;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function SearchResultCard({ post }: SearchResultCardProps) {
  return (
    <Link to={`/posts/${post.id}`}>
      <Card className="flex flex-col sm:flex-row gap-5 p-5 bg-[#161618] border-[#2A2A2C] hover:border-[#D4AF37]/30 transition-colors cursor-pointer">

        {/* ── Left: Vote Counter ── */}
        <div className="flex flex-col items-center sm:items-end justify-start min-w-[80px] gap-2 text-sm">
          <div className="flex items-center gap-1">
            <ArrowUp className="h-3.5 w-3.5 text-gray-500" />
            <span className="text-lg font-bold text-[#D4AF37] font-fira-code">{post.vote_score}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <ArrowDown className="h-3 w-3" />
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <MessageSquare className="h-3 w-3" />
            <span>{post.comments_count}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Eye className="h-3 w-3" />
            <span>{post.view_count}</span>
          </div>
        </div>

        {/* ── Right: Content ── */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Category + Status + Time */}
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <Badge variant="outline" className="text-[11px] border-[#2A2A2C] text-gray-400">
              {post.category.name}
            </Badge>
            <span className="text-[11px] text-gray-500">{timeAgo(post.created_at)}</span>
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {post.title}
          </h3>

          <p className="text-sm text-gray-400 line-clamp-2">
            {post.body}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {post.tags?.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="text-[11px] font-fira-code"
                style={{ color: tag.color || '#D4AF37' }}
              >
                #{tag.name}
              </span>
            ))}

            <div className="flex items-center gap-2 ml-auto">
              <Avatar className="h-5 w-5 border border-[#2A2A2C]">
                <AvatarImage src={post.user.avatar_url || ''} />
                <AvatarFallback className="bg-[#0B0B0C] text-[10px] text-[#D4AF37]">
                  {post.user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] text-gray-500">{post.user.username}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
