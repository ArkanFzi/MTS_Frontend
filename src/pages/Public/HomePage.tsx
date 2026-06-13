import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { getPosts } from "../../features/User/F16_Post/api";
import type { Post } from "../../features/User/F16_Post/types";
import PostFeedCard from "../../features/User/F16_Post/components/PostFeedCard";
import FeedSkeleton from "../../features/User/F16_Post/components/FeedSkeleton";
import TrendingSidebar from "../../features/Common/F7_TrendingPopularPost/components/TrendingSidebar";
import { Button } from "../../components/ui/button";
import ResponsiveLayout from "../../components/shared/ResponsiveLayout";

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
  const hasMore = paginator
    ? paginator.current_page < paginator.last_page
    : false;

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

  return (
    <ResponsiveLayout sidebar={<TrendingSidebar />}>
      <div className="py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Home <span className="text-[#D4AF37]">Feed</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pertanyaan terbaru dari komunitas
          </p>
        </div>

        {/* LIST FEED */}
        {isLoading ? (
          <FeedSkeleton />
        ) : (
          <div
            className={`flex flex-col gap-4 transition-opacity ${
              isFetching && page > 1 ? "opacity-60" : "opacity-100"
            }`}
          >
            {displayPosts.map((post) => (
              <PostFeedCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 gap-2 rounded-full"
              onClick={handleLoadMore}
              disabled={isFetching}
            >
              {isFetching ? (
                "Loading..."
              ) : (
                <>
                  Load More <ChevronDown className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}
