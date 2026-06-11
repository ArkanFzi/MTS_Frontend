import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { getPosts } from '../../features/User/F16_Post/api';
import type { Post } from '../../features/User/F16_Post/types';
import PostFeedCard from '../../features/User/F16_Post/components/PostFeedCard';
import TrendingSidebar from '../../features/Common/F7_TrendingPopularPost/components/TrendingSidebar';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#161618] border border-[#2A2A2C] rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-5" />
              <Skeleton className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-16 h-3" />
              </div>
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
              <div className="flex gap-2">
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-24 h-3 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', 'feed', page],
    queryFn: () => getPosts(page),
  });

  const paginator = data?.data;
  const entries = paginator?.data || [];
  const hasMore = paginator ? paginator.current_page < paginator.last_page : false;

  // Accumulate across pages
  if (data?.data?.data) {
    if (page === 1) {
      if (allPosts.length !== entries.length) {
        setAllPosts(entries);
      }
    } else {
      const combined = [...allPosts.slice(0, (page - 1) * (paginator?.per_page || 10)), ...entries];
      if (combined.length !== allPosts.length) {
        setAllPosts(combined);
      }
    }
  }

  const displayPosts = page === 1 ? entries : allPosts;

  return (
    /* PERUBAHAN DI SINI: Menambahkan `items-start` pada container flex utama */
    <div className="flex items-start gap-6 py-8 px-6 max-w-6xl mx-auto">
      {/* ── Main Feed ── */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Home Feed</h1>
          <p className="text-sm text-gray-500 mt-1">Pertanyaan terbaru dari komunitas</p>
        </div>

        {isLoading && page === 1 && <FeedSkeleton />}

        {isError && (
          <p className="text-red-400 text-center py-20">
            Gagal memuat postingan. Silakan refresh halaman.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {displayPosts.map((post) => (
            <PostFeedCard key={post.id} post={post} />
          ))}
        </div>

        {!isLoading && !isError && entries.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
            <p className="text-gray-500">Belum ada postingan di feed.</p>
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 gap-2"
              onClick={() => setPage((p) => p + 1)}
            >
              Load More
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {isLoading && page > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              Loading more...
            </div>
          </div>
        )}
      </div>

      {/* ── Right Sidebar: Trending ── */}
      {/* Tetap menggunakan sticky top-8 self-start */}
      <aside className="w-[320px] flex-shrink-0 hidden xl:block sticky top-8 self-start">
        <TrendingSidebar />
      </aside>
    </div>
  );
}