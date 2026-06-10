import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '../../components/ErrorFallback/ErrorFallback';
import TagPostCard from '../../features/Common/F5_FilterByTag/components/TagPostCard';
import type { TagPost, TagPostsResponse } from '../../features/Common/F5_FilterByTag/types';
import { getPostsByTag } from '../../features/Common/F5_FilterByTag/api';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

function TagFilterContent() {
  const { slug } = useParams<{ slug: string }>();
  const { showBoundary } = useErrorBoundary();

  const [posts, setPosts] = useState<TagPost[]>([]);
  const [meta, setMeta] = useState<TagPostsResponse['meta'] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  // Reset when slug changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
  }, [slug]);

  const fetchTagContent = useCallback(async () => {
    if (!slug) return;

    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await getPostsByTag(slug, page);

      if (res.status === 'success') {
        if (page === 1) {
          setPosts(res.data);
        } else {
          setPosts(prev => [...prev, ...res.data]);
        }
        setMeta(res.meta);
      } else {
        throw new Error(res.message || 'Terjadi kesalahan sistem.');
      }
    } catch (err: any) {
      showBoundary(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug, page, showBoundary]);

  useEffect(() => {
    fetchTagContent();
  }, [fetchTagContent]);

  if (loading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  const hasMore = meta ? meta.current_page < meta.last_page : false;

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-[#D4AF37] transition-colors font-fira-code mb-2">
        <ArrowLeft className="w-3.5 h-3.5" /> EXPLORE_ROOT / TAGS
      </Link>

      {/* Tag header */}
      <div className="flex items-center gap-3">
        <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 text-sm px-3 py-1">
          #{slug}
        </Badge>
        {meta && (
          <span className="text-sm text-zinc-500">{meta.total} postingan</span>
        )}
      </div>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl text-zinc-500 font-inter">
            <p>Belum ada postingan untuk tag ini.</p>
          </div>
        ) : (
          posts.map((post) => <TagPostCard key={post.id} post={post} />)
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 pb-8">
          <Button
            variant="outline"
            className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8"
            disabled={loadingMore}
            onClick={() => setPage(p => p + 1)}
          >
            {loadingMore ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memuat...</>
            ) : "Muat Lebih Banyak"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function TagFilterPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TagFilterContent />
    </ErrorBoundary>
  );
}
