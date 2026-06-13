// src/pages/User/MyPostsPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, FileText, Plus, AlertCircle } from 'lucide-react';
import { getMyPosts } from '../../features/User/F16_Post/api';
import PostCardItem from '../../features/User/F16_Post/components/PostCardItem';
import { Button } from '../../components/ui/button';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';
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
    <ResponsiveLayout>
      {/* w-full py-8 dengan padding responsif menyamakan standar Trending Page */}
      <div className="w-full py-8 px-4 md:px-0">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-[#D4AF37]" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Postingan Saya
              </h1>
            </div>
            <p className="text-sm text-gray-400 ml-9">
              {paginator ? `${paginator.total} postingan terkumpul` : 'Memuat jumlah postingan...'}
            </p>
          </div>
          
          <Link to="/posts/create">
            <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold text-sm px-5 py-2.5 h-auto rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.1)] gap-2">
              <Plus className="w-4 h-4 stroke-[3]" />
              Buat Baru
            </Button>
          </Link>
        </div>

        {/* ── Loading State ── */}
        {isLoading && <MyPostsSkeleton />}

        {/* ── Error State ── */}
        {isError && (
          <div className="text-center py-20 border border-red-900/20 bg-red-950/5 rounded-xl">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2 opacity-50" />
            <p className="text-red-400 text-sm">Gagal memuat postingan kamu.</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!isLoading && !isError && posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl animate-in fade-in duration-300">
            <FileText className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-5">Kamu belum membuat postingan sama sekali.</p>
            <Link to="/posts/create">
              <Button className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold text-sm px-5 py-2.5 h-auto rounded-full cursor-pointer gap-2">
                <Plus className="w-4 h-4 stroke-[3]" />
                Buat Pertanyaan Pertama
              </Button>
            </Link>
          </div>
        )}

{/* ── Posts List ── */}
{!isLoading && !isError && posts.length > 0 && (
  /* Mengubah gap-4 menjadi gap-3 agar jarak antar card lebih rapat */
  <div className="flex flex-col gap-4">
    {posts.map((post, index) => (
      <div 
        key={post.id}
        className="animate-in fade-in slide-in-from-bottom-2 duration-500"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <PostCardItem post={post} />
      </div>
    ))}
  </div>
)}

        {/* ── Pagination Load More ── */}
        {hasMore && !isLoading && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              className="border-[#2A2A2C] text-[#D4AF37] hover:text-white hover:bg-[#1A1A1C] hover:border-gray-600 font-semibold text-sm px-6 py-2.5 h-auto rounded-full transition-colors cursor-pointer gap-2"
            >
              Load More
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}