// src/features/User/F24_BookmarkPost/components/BookmarkCard.tsx
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, MessageSquare, Eye } from 'lucide-react';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import BookmarkToggle from './BookmarkToggle';

interface BookmarkItem {
  id: string;
  post_id: string;
  notes?: string;
  post?: {
    id: string;
    title: string;
    body?: string;
    excerpt?: string;
    created_at?: string;
    votes_count?: number;
    views_count?: number;
    answers_count?: number;
    points?: number;
    category?: { name: string };
    tags?: { id: string; name: string; color?: string }[];
    user?: { username: string; avatar_url?: string };
  };
}

interface BookmarkCardProps {
  item: BookmarkItem;
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

export default function BookmarkCard({ item }: BookmarkCardProps) {
  if (!item) return null;
  const post = item.post;
  if (!post) return null;

  return (
    <Card className="p-5 bg-[#161618] border-[#2A2A2C] hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
      <div className="flex flex-col gap-3">

        {/* ── TOP: Category, Time, BookmarkToggle ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="text-[11px] bg-[#D4AF37] text-[#171718] font-semibold px-3 py-3 border-none">
              {post.category?.name || 'Programming'}
            </Badge>
            <span className="text-[11px] font-semibold text-gray-500">
              {post.created_at ? timeAgo(post.created_at) : 'Baru saja'}
            </span>
          </div>
          <BookmarkToggle postId={item.post_id} isInitiallyBookmarked={true} />
        </div>

        {/* ── MIDDLE: Title & Body ── */}
        <div className="flex flex-col gap-2">
          <Link to={`/posts/${post.id}`}>
            <h3 className="mt-2 text-base font-semibold text-white hover:text-[#D4AF37] transition-colors line-clamp-1">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-400 line-clamp-2">
            {post.excerpt || post.body || 'Tidak ada deskripsi singkat untuk postingan ini.'}
          </p>

          {item.notes && (
            <div className="p-2 bg-zinc-900/40 border border-zinc-900 rounded-lg text-xs text-zinc-400 italic">
              <span className="font-bold text-zinc-500 not-italic block text-[10px] uppercase tracking-wider mb-0.5">Catatan Lu:</span>
              "{item.notes}"
            </div>
          )}
        </div>

        {/* ── BOTTOM: Stats + Tags + User ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 border-t border-[#2A2A2C] pt-4">

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex flex-col items-center gap-0.5">
              <ArrowUp className="h-5 w-5 hover:text-[#D4AF37] transition-colors" />
              <span className="text-[11px] font-bold leading-none text-[#D4AF37]">
                {post.points ?? post.votes_count ?? 0}
              </span>
              <ArrowDown className="h-5 w-5 hover:text-[#D4AF37] transition-colors" />
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-5 w-5 hover:text-[#D4AF37]" />
              <span className="text-sm font-bold leading-none text-[#D4AF37]">
                {post.answers_count ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-6 w-6" />
              <span className="text-sm font-bold leading-none text-[#D4AF37]">
                {post.views_count ?? 0}
              </span>
            </div>
          </div>

          {/* Tags & User */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              {post.tags && post.tags.length > 0 ? (
                post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-[11px] font-fira-code"
                    style={{ color: tag.color || '#D4AF37' }}
                  >
                    #{tag.name}
                  </span>
                ))
              ) : (
                <>
                  <span className="text-[11px] font-fira-code text-red-500/80">#Laravel</span>
                  <span className="text-[11px] font-fira-code text-purple-400/80">#PHP</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 ml-0 sm:ml-4 border-l-[2px] border-[#2A2A2C] pl-4">
              <Avatar className="h-5 w-5 border border-[#2A2A2C]">
                <AvatarImage src={post.user?.avatar_url || ''} />
                <AvatarFallback className="bg-[#0B0B0C] text-[10px] text-[#D4AF37]">
                  {(post.user?.username || 'US').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-[11px] text-gray-500">
                {post.user?.username || 'suhu'}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
}