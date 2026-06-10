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
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
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
            {post.is_answered && (
              <Badge className="bg-green-950/50 text-green-400 border-green-900 text-[10px] h-5 font-bold uppercase tracking-wider">
                Sudah Dijawab
              </Badge>
            )}
            <span className="text-[11px] text-gray-500">{timeAgo(post.created_at)}</span>
          </div>
          
          <h3 className="text-base font-semibold text-white hover:text-[#D4AF37] transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {post.body}
          </p>
          
          <div className="flex flex-wrap items-center justify-between mt-2 gap-4">
            <div className="flex gap-2 flex-wrap">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge 
                  key={tag.id} 
                  variant="outline"
                  className="text-[11px] bg-[#1A1A1C] border-[#2A2A2C] font-medium"
                  style={tag.color ? { color: tag.color } : undefined}
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5 border border-[#2A2A2C]">
                <AvatarImage src={post.user.avatar_url || ''} />
                <AvatarFallback className="bg-[#D4AF37] text-black text-[9px] font-bold">
                  {post.user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-400">
                {post.user.username}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
