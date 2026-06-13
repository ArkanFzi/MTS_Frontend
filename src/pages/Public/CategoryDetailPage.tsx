// src/pages/Public/CategoryDetailPage.tsx

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

import ErrorFallback from "../../components/ErrorFallback/ErrorFallback";
import CategoryHeader from "../../features/Common/F6_FilterByCategory/components/CategoryHeader";
import CategoryPostCard from "../../features/Common/F6_FilterByCategory/components/CategoryPostCard";
import CategoryInfoSidebar from "../../features/Common/F6_FilterByCategory/components/CategoryInfoSidebar";
import type {
  CategoryPost,
  CategoryInfo,
  CategoryTagOption,
  CategoryPostsResponse,
} from "../../features/Common/F6_FilterByCategory/types";
import { getPostsByCategory } from "../../features/Common/F6_FilterByCategory/api";
import PostListSkeleton from "../../components/shared/PostListSkeleton";
import Pagination from "../../components/shared/Pagination";

import type { SortTab } from "../../features/Common/F6_FilterByCategory/types";

const TABS: { key: SortTab; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "bountied", label: "Bountied" },
  { key: "unanswered", label: "Unanswered" },
];



function CategoryDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showBoundary } = useErrorBoundary();

  const [posts, setPosts] = useState<CategoryPost[]>([]);
  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [tags, setTags] = useState<CategoryTagOption[]>([]);
  const [meta, setMeta] = useState<CategoryPostsResponse["meta"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<SortTab>("newest");
  const [activeTag, setActiveTag] = useState<string>(
    searchParams.get("tag") || "",
  );

  const activeTagName = useMemo(() => {
    const tag = tags.find((t) => t.slug === activeTag);
    return tag?.name || "";
  }, [tags, activeTag]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPosts([]);
    setCategory(null);
    setTags([]);
    setPage(1);
    setActiveTab("newest");
    setActiveTag(searchParams.get("tag") || "");
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  const fetchCategoryContent = useCallback(async () => {
    if (!slug) return;

    setLoading(true);

    try {
      const res = await getPostsByCategory(
        slug,
        page,
        activeTab,
        activeTag || undefined,
      );

      if (res.status === "success") {
        setPosts(res.data);
        setCategory(res.category);
        setTags(res.tags || []);
        setMeta(res.meta);
      } else {
        throw new Error(res.message || "Terjadi kesalahan sistem.");
      }
    } catch (err: unknown) {
      showBoundary(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [slug, page, activeTab, activeTag, showBoundary]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchCategoryContent();
  }, [fetchCategoryContent]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleTagChange = (tagSlug: string) => {
    setActiveTag(tagSlug);
    setPage(1);
    setPosts([]);
    if (tagSlug) {
      setSearchParams({ tag: tagSlug });
    } else {
      setSearchParams({});
    }
  };

  const handleTabChange = (tab: SortTab) => {
    setActiveTab(tab);
    setPage(1);
    setPosts([]);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex gap-6 py-8 px-6 max-w-6xl mx-auto">
      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0">
        <CategoryHeader
          category={category}
          totalPosts={meta?.total || 0}
          tags={tags}
          activeTag={activeTag}
          onTagChange={handleTagChange}
        />

        <div className="flex items-center gap-1 border-b border-[#2A2A2C] mb-5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? "text-[#D4AF37]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
              )}
            </button>
          ))}
        </div>

        {loading && <PostListSkeleton />}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
            <p className="text-gray-500">
              {activeTab === "unanswered"
                ? "Tidak ada pertanyaan yang belum terjawab untuk kategori ini."
                : "Belum ada postingan untuk kategori ini."}
            </p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <CategoryPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {meta && !loading && (
          <Pagination
            current={meta.current_page}
            last={meta.last_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* ── Right Sidebar ── */}
      <aside className="w-[320px] flex-shrink-0 hidden xl:block sticky top-8 self-start">
        <CategoryInfoSidebar
          category={category}
          totalPosts={meta?.total || 0}
          activeTagName={activeTagName}
          relatedTags={tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            color: tag.color,
            count: tag.count ?? 0,
          }))}
          activeTagSlug={activeTag}
          categorySlug={slug || ''}
        />
      </aside>
    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CategoryDetailContent />
    </ErrorBoundary>
  );
}
