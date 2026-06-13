import { Link } from 'react-router-dom';
// Hapus ArrowUp dan ArrowDown dari lucide-react karena sudah ditangani oleh VoteControl
import { Eye, MessageCircle } from 'lucide-react'; 
import type { Post } from '../types';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../components/ui/avatar';
// Import VoteControl dari fitur VoteSystem
import VoteControl from '../../F22_VoteSystem/components/VoteControl';

interface PostFeedCardProps {
  post: Post;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
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

export default function PostFeedCard({ post }: PostFeedCardProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618] py-0 hover:border-[#D4AF37]/30 transition-colors">
      <div className="flex items-start gap-4 p-5">
        
        {/* ── Vote Counter Komponen (Menggantikan HTML statis lama) ── */}
        <VoteControl
          targetId={post.id}
          targetType="post"
          initialScore={post.vote_score}
          userVote={post.user_vote}
          direction="vertical"
          className="min-w-[50px] pt-0.5"
        />

        {/* ── Post Content ── */}
        <div className="flex-1 min-w-0">
          {/* Top row: status + time */}
          <div className="flex items-center gap-2 mb-2">
            {post.is_answered && (
              <Badge className="bg-green-950/50 text-green-400 border-green-900 text-[10px] h-5 font-bold uppercase tracking-wider">
                Sudah Dijawab
              </Badge>
            )}
            <span className="text-xs text-gray-500">{timeAgo(post.created_at)}</span>
          </div>

          {/* Title */}
          <Link to={`/posts/${post.id}`}>
            <h2 className="text-base font-semibold text-white hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2 cursor-pointer">
              {post.title}
            </h2>
          </Link>

          {/* Body excerpt */}
          <p className="text-sm text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {post.body?.substring(0, 160)}
            {post.body && post.body.length > 160 ? '...' : ''}
          </p>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {post.category && (
              <Badge
                variant="outline"
                className="text-[11px] bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] px-2.5 py-0.5 h-auto font-medium"
              >
                {post.category.name}
              </Badge>
            )}
            {post.tags?.slice(0, 4).map((tag) => (
              <Link key={tag.id} to={`/tags/${tag.slug}`} onClick={(e) => e.stopPropagation()}>
                <Badge
                  variant="outline"
                  className="text-[11px] bg-[#1A1A1C] text-[#D4AF37] border-[#2A2A2C] px-2.5 py-0.5 h-auto font-medium hover:border-[#D4AF37]/50 cursor-pointer transition-colors"
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>

          {/* Metadata row */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {formatCount(post.view_count)}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              {post.comments_count ?? 0}
            </span>
            {post.user && (
              <div className="flex items-center gap-2 ml-auto">
                <Avatar className="h-5 w-5">
                  {post.user.avatar_url ? (
                    <AvatarImage src={post.user.avatar_url} alt={post.user.username} />
                  ) : null}
                  <AvatarFallback className="bg-[#D4AF37] text-black text-[9px] font-bold">
                    {post.user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-400 hover:text-[#D4AF37] transition-colors cursor-pointer">
                  {post.user.username}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}