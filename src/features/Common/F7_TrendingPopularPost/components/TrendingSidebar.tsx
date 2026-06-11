import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Flame } from 'lucide-react';
import { getTrendingPosts } from '../api';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Skeleton } from '../../../../components/ui/skeleton';

export default function TrendingSidebar() {
  const { data, isLoading } = useQuery({
    queryKey: ['trending', 'sidebar'],
    queryFn: () => getTrendingPosts('trending', 2),
  });

  const posts = data?.data?.slice(0, 2) || []; //untuk memberikan 

  return (
    <Card className="border-[#2A2A2C] bg-[#161618] py-0 sticky top-4">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 p-4 border-b border-[#2A2A2C]">
        <Flame className="w-4 h-4 text-red-500" />
        <h3 className="text-sm font-bold text-white">Trending Saat Ini</h3>
      </div>

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="p-4 flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-3/4 h-3" />
              <Skeleton className="w-16 h-4 mt-1" />
            </div>
          ))}
        </div>
      )}

      {/* ── Trending posts list ── */}
      {!isLoading && posts.length > 0 && (
        <div className="flex flex-col">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
              className={`block p-4 hover:bg-[#1A1A1C] transition-colors ${
                index < posts.length - 1 ? 'border-b border-[#2A2A2C]/50' : ''
              }`}
            >
              {/* Top: HOT badge + reply count */}
              <div className="flex items-center gap-2 mb-1.5">
                <Badge className="bg-red-950/50 text-red-400 border-red-900 text-[9px] h-4 font-bold uppercase tracking-wider">
                  HOT
                </Badge>
                <span className="text-[11px] text-gray-500">
                  {post.comments_count ?? 0} replies
                </span>
              </div>

              {/* Title */}
              <h4 className="text-[13px] font-semibold text-white line-clamp-2 mb-2 hover:text-[#D4AF37] transition-colors">
                {post.title}
              </h4>

              {/* First tag */}
              {post.tags?.[0] && (
                <Badge
                  variant="outline"
                  className="text-[10px] bg-[#1A1A1C] text-[#D4AF37] border-[#2A2A2C] px-2 h-auto font-medium"
                >
                  #{post.tags[0].name}
                </Badge>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && posts.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-xs text-gray-500">Belum ada trending post.</p>
        </div>
      )}
    </Card>
  );
}
