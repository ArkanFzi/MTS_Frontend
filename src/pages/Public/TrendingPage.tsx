import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Flame, Eye } from 'lucide-react';
import { getTrendingPosts } from '../../features/Common/F7_TrendingPopularPost/api';
import TrendingPostCard from '../../features/Common/F7_TrendingPopularPost/components/TrendingPostCard';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';

type TabType = 'trending' | 'popular';

function TrendingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-5 p-5 rounded-xl border border-[#2A2A2C] bg-[#161618]">
          <Skeleton className="w-10 h-8 rounded-md" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="w-12 h-4 rounded-full" />
              <Skeleton className="w-20 h-4 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-5" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-[90px] h-12 rounded-lg" />
            <Skeleton className="w-[90px] h-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trending');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['trending', activeTab],
    queryFn: () => getTrendingPosts(activeTab, 10),
  });

  const posts = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 font-['Inter']">
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-[#D4AF37]" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Trending Posts</h1>
        </div>
        <p className="text-sm text-gray-400 ml-10">
          The most active and highly rated discussions happening right now.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-2 mb-6 border-b border-[#2A2A2C] pb-3">
        <Button
          variant={activeTab === 'trending' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full px-5 text-xs font-semibold gap-1.5 ${
            activeTab === 'trending'
              ? 'bg-[#D4AF37] text-black hover:bg-[#c29f2f] border-0'
              : 'border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent'
          }`}
          onClick={() => setActiveTab('trending')}
        >
          <Flame className="w-3.5 h-3.5" />
          Trending
        </Button>
        <Button
          variant={activeTab === 'popular' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-full px-5 text-xs font-semibold gap-1.5 ${
            activeTab === 'popular'
              ? 'bg-[#D4AF37] text-black hover:bg-[#c29f2f] border-0'
              : 'border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent'
          }`}
          onClick={() => setActiveTab('popular')}
        >
          <Eye className="w-3.5 h-3.5" />
          Most Viewed
        </Button>
      </div>

      {/* ── Content ── */}
      {isLoading && <TrendingSkeleton />}

      {isError && (
        <p className="text-red-400 text-center py-20">
          Failed to load trending posts. Please try again later.
        </p>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
          <p className="text-gray-500">No trending posts available right now.</p>
        </div>
      )}

      {!isLoading && !isError && posts.length > 0 && (
        <div className="flex flex-col gap-3">
          {posts.map((post, index) => (
            <TrendingPostCard key={post.id} post={post} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
