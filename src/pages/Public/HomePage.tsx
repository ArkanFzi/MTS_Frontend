import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MessageCircle, ThumbsUp, Eye, ArrowUp } from 'lucide-react';
import { getPosts } from '../../features/User/F16_Post/api';

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', 'feed'],
    queryFn: () => getPosts(1),
  });

  const paginator = data?.data;
  const posts = paginator?.data || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Home Feed</h1>
        <p className="text-sm text-gray-500 mt-1">Pertanyaan terbaru dari komunitas</p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#D4AF37] w-8 h-8" />
        </div>
      )}

      {isError && (
        <p className="text-red-400 text-center py-20">Gagal memuat postingan. Silakan refresh halaman.</p>
      )}

      <div className="flex flex-col gap-4">
        {Array.isArray(posts) && posts.map((post: any) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="block p-5 bg-[#161618] border border-[#2A2A2C] rounded-xl hover:border-[#D4AF37]/50 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 min-w-[50px]">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm font-bold">{post.vote_score || 0}</span>
                </div>
                <span className="text-[10px] text-gray-500">votes</span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                  {post.body?.substring(0, 150)}...
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  {post.category && (
                    <span className="text-xs px-2 py-0.5 bg-[#0B0B0C] text-gray-400 rounded border border-[#2A2A2C]">
                      {post.category.name}
                    </span>
                  )}
                  {post.tags?.slice(0, 3).map((tag: any) => (
                    <span key={tag.id} className="text-xs text-[#D4AF37]">
                      #{tag.name}
                    </span>
                  ))}

                  <div className="flex items-center gap-3 ml-auto text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {post.view_count || 0}
                    </span>
                    {post.user && (
                      <span className="text-gray-400">by {post.user.username}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {!isLoading && (!posts || posts.length === 0) && (
          <div className="text-center py-20">
            <p className="text-gray-500">Belum ada postingan di feed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
