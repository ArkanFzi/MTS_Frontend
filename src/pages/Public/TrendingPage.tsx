import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Flame, Eye, AlertCircle } from 'lucide-react';
import { getTrendingPosts } from '../../features/Common/F7_TrendingPopularPost/api';
import TrendingPostCard from '../../features/Common/F7_TrendingPopularPost/components/TrendingPostCard';
import { Button } from '../../components/ui/button';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

import type { TabType } from '../../features/Common/F7_TrendingPopularPost/types';

import TrendingSkeleton from '../../features/Common/F7_TrendingPopularPost/components/TrendingSkeleton';

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('trending');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['trending', activeTab],
    queryFn: () => getTrendingPosts(activeTab, 10),
  });

  const posts = data?.data || [];

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        {/* ── Header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Trending Posts</h1>
          </div>
          <p className="text-sm text-gray-400 ml-9">
            Diskusi paling aktif dan populer saat ini.
          </p>
        </div>

        {/* ── Tabs ── */}
<div className="flex items-center gap-2 mb-6 border-b border-[#2A2A2C] pb-4">
  <Button
    variant="outline"
    size="sm"
    className={`cursor-pointer text-[11px] px-3 py-1 h-auto transition-colors whitespace-nowrap rounded-full ${
      activeTab === 'trending'
        ? "!bg-[#D4AF37]/10 !border-[#D4AF37]/40 !text-[#D4AF37]"
        : "!border-[#2A2A2C] !text-gray-400 hover:!text-white hover:!border-gray-600 !bg-[#1A1A1C]"
    }`}
    onClick={() => setActiveTab('trending')}
  >
    <Flame className="w-5 h-5 mr-2" />
    Trending
  </Button>

  <Button
    variant="outline"
    size="sm"
    className={`cursor-pointer text-[11px] px-3 py-1 h-auto transition-colors whitespace-nowrap rounded-full ${
      activeTab === 'popular'
        ? "!bg-[#D4AF37]/10 !border-[#D4AF37]/40 !text-[#D4AF37]"
        : "!border-[#2A2A2C] !text-gray-400 hover:!text-white hover:border-gray-600 !bg-[#1A1A1C]"
    }`}
    onClick={() => setActiveTab('popular')}
  >
    <Eye className="w-5 h-5 mr-2" />
    Most Viewed
  </Button>
</div>

        {/* ── Content ── */}
        {isLoading && <TrendingSkeleton />}

        {isError && (
          <div className="text-center py-20 border border-red-900/20 bg-red-950/5 rounded-xl">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2 opacity-50" />
            <p className="text-red-400 text-sm">Gagal memuat postingan.</p>
          </div>
        )}

        {!isLoading && !isError && posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
            <p className="text-gray-500 text-sm">Belum ada postingan untuk kategori ini.</p>
          </div>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <div className="flex flex-col gap-3">
            {posts.map((post, index) => (
              <div 
                key={post.id} 
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TrendingPostCard post={post} rank={index + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}