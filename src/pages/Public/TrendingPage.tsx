import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Flame, Eye, AlertCircle } from 'lucide-react';
import { getTrendingPosts } from '../../features/Common/F7_TrendingPopularPost/api';
import TrendingPostCard from '../../features/Common/F7_TrendingPopularPost/components/TrendingPostCard';
import { Button } from '../../components/ui/button';

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
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 font-['Inter']">
      {/* ── Header ── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-[#161618] border border-[#2A2A2C] rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
            Trending Posts
          </h1>
        </div>
        <p className="text-sm text-zinc-500 sm:ml-14 font-fira-code">
          The most active and highly rated discussions happening right now.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-3 mb-8 border-b border-[#2A2A2C] pb-4">
        <Button
          variant={activeTab === 'trending' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-xl px-6 py-5 text-sm font-semibold gap-2 transition-all duration-300 ${
            activeTab === 'trending'
              ? 'bg-[#D4AF37] text-black hover:bg-[#ebd077] shadow-[0_0_20px_rgba(212,175,55,0.25)] border-0 scale-105'
              : 'border-[#2A2A2C] text-zinc-400 hover:text-white hover:border-[#D4AF37]/40 hover:bg-[#161618] bg-transparent'
          }`}
          onClick={() => setActiveTab('trending')}
        >
          <Flame className={`w-4 h-4 ${activeTab === 'trending' ? 'text-black' : 'text-zinc-500'}`} />
          Trending
        </Button>
        <Button
          variant={activeTab === 'popular' ? 'default' : 'outline'}
          size="sm"
          className={`rounded-xl px-6 py-5 text-sm font-semibold gap-2 transition-all duration-300 ${
            activeTab === 'popular'
              ? 'bg-[#D4AF37] text-black hover:bg-[#ebd077] shadow-[0_0_20px_rgba(212,175,55,0.25)] border-0 scale-105'
              : 'border-[#2A2A2C] text-zinc-400 hover:text-white hover:border-[#D4AF37]/40 hover:bg-[#161618] bg-transparent'
          }`}
          onClick={() => setActiveTab('popular')}
        >
          <Eye className={`w-4 h-4 ${activeTab === 'popular' ? 'text-black' : 'text-zinc-500'}`} />
          Most Viewed
        </Button>
      </div>

      {/* ── Content ── */}
      {isLoading && <TrendingSkeleton />}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-red-950/20 border border-red-900/50 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-red-500 mb-4 opacity-80" />
          <p className="text-red-400 font-medium text-center">
            Failed to load trending posts.
          </p>
          <p className="text-red-500/70 text-sm mt-1 text-center">
            Please check your connection and try again later.
          </p>
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-[#2A2A2C] bg-[#161618]/50 rounded-2xl">
          <div className="p-4 bg-[#0B0B0C] rounded-full mb-4 border border-[#2A2A2C]">
            <TrendingUp className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400 font-fira-code text-sm text-center">
            No trending posts available right now.
          </p>
        </div>
      )}

      {!isLoading && !isError && posts.length > 0 && (
        <div className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TrendingPostCard post={post} rank={index + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}