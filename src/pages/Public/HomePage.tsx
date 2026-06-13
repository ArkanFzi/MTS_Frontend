// src/pages/Public/HomePage.tsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { getPosts } from "../../features/User/F16_Post/api";
import type { Post } from "../../features/User/F16_Post/types";
import PostFeedCard from "../../features/User/F16_Post/components/PostFeedCard";
import TrendingSidebar from "../../features/Common/F7_TrendingPopularPost/components/TrendingSidebar";
import { Button } from "../../components/ui/button";
import ResponsiveLayout from "../../components/shared/ResponsiveLayout";
import { Skeleton } from "../../components/ui/skeleton";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts", "feed", page],
    queryFn: () => getPosts(page),
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
  });

  const paginator = data?.data;
  const entries = paginator?.data || [];
  const hasMore = paginator ? paginator.current_page < paginator.last_page : false;

  // Update list post saat data berubah
  if (data?.data?.data) {
    if (page === 1) {
      if (allPosts.length !== entries.length) setAllPosts(entries);
    } else {
      const combined = [
        ...allPosts.slice(0, (page - 1) * (paginator?.per_page || 10)),
        ...entries,
      ];
      if (combined.length !== allPosts.length) setAllPosts(combined);
    }
  }

  const displayPosts = page === 1 ? entries : allPosts;

  // Prefetch halaman berikutnya
  const handleLoadMore = () => {
    const nextPage = page + 1;
    queryClient.prefetchQuery({
      queryKey: ["posts", "feed", nextPage],
      queryFn: () => getPosts(nextPage),
    });
    setPage(nextPage);
  };

  const FeedSkeleton = () => (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-5 p-5 rounded-xl border border-[#2A2A2C] bg-[#161618]">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-10 w-20 rounded-lg flex-shrink-0" />
        </div>
      ))}
    </div>
  );

  return (
    <ResponsiveLayout sidebar={null}>
      <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
        {/* KOLOM KIRI (Feed) */}
        <div className="flex-1 w-full min-w-0">
<div className="mb-6 lg:mb-1">
  <br />
  <h1 className="text-2xl font-bold text-white">
    Home <span className="text-[#D4AF37]">Feed</span>
  </h1>
</div>

          <div className="block lg:hidden mb-6">
            <TrendingSidebar />
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500">Pertanyaan terbaru dari komunitas</p>
          </div>

          {/* LIST FEED */}
          {isLoading ? (
            <FeedSkeleton />
          ) : (
            <div className={`flex flex-col gap-4 transition-opacity ${isFetching && page > 1 ? "opacity-60" : "opacity-100"}`}>
              {displayPosts.map((post) => (
                <PostFeedCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {hasMore && !isLoading && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                className="border-[#2A2A2C] text-[#D4AF37]"
                onClick={handleLoadMore}
                disabled={isFetching}
              >
                {isFetching ? "Loading..." : <>Load More <ChevronDown className="w-4 h-4 ml-2" /></>}
              </Button>
            </div>
          )}
        </div>

        {/* KOLOM KANAN */}
        <div className="hidden lg:block w-[320px] flex-shrink-0 self-start sticky top-26">
          <TrendingSidebar />
        </div>
      </div>
    </ResponsiveLayout>
  );
}