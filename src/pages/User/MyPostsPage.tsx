// src/pages/User/MyPostsPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, FileText, Plus } from 'lucide-react';
import { getMyPosts } from '../../features/User/F16_Post/api';
import PostCardItem from '../../features/User/F16_Post/components/PostCardItem';
import { Button } from '../../components/ui/button';

import MyPostsSkeleton from '../../features/User/F16_Post/components/MyPostsSkeleton';

export default function MyPostsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-posts', page],
    queryFn: () => getMyPosts(page),
  });

  const paginator = data?.data;
  const posts = paginator?.data || [];
  const hasMore = paginator ? paginator.current_page < paginator.last_page : false;

  return (
    <div className="max-w-3xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
            Postingan Saya
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {paginator ? `${paginator.total} postingan` : 'Memuat...'}
          </p>
        </div>
        <Link to="/posts/create">
          <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 gap-2">
            <Plus className="w-4 h-4" />
            Buat Baru
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && <MyPostsSkeleton />}

      {/* Error */}
      {isError && (
        <div className="text-center py-20">
          <p className="text-red-400">Gagal memuat postingan.</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && posts.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
          <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Kamu belum membuat postingan.</p>
          <Link to="/posts/create">
            <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 gap-2">
              <Plus className="w-4 h-4" />
              Buat Pertanyaan Pertama
            </Button>
          </Link>
        </div>
      )}

      {/* Posts list */}
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <PostCardItem key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 gap-2"
          >
            Load More
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
