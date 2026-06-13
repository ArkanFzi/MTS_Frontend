// src/pages/Public/TagFilterPage.tsx

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";

import ErrorFallback from "../../components/ErrorFallback/ErrorFallback";
import TagHeader from "../../features/Common/F5_FilterByTag/components/TagHeader";
import TagPostCard from "../../features/Common/F5_FilterByTag/components/TagPostCard";
import TagInfoSidebar from "../../features/Common/F5_FilterByTag/components/TagInfoSidebar";
import type {
  TagPost,
  TagInfo,
  TagPostsResponse,
} from "../../features/Common/F5_FilterByTag/types";
import { getPostsByTag } from "../../features/Common/F5_FilterByTag/api";
import PostListSkeleton from "../../components/shared/PostListSkeleton";
import Pagination from "../../components/shared/Pagination";

import type { SortTab } from "../../features/Common/F5_FilterByTag/types";

const TABS: { key: SortTab; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "bountied", label: "Bountied" },
  { key: "unanswered", label: "Unanswered" },
];



function TagFilterContent() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showBoundary } = useErrorBoundary();

  const [posts, setPosts] = useState<TagPost[]>([]);
  const [tag, setTag] = useState<TagInfo | null>(null);
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [meta, setMeta] = useState<TagPostsResponse["meta"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<SortTab>("newest");
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get("category") || "",
  );

  const activeCategoryName = useMemo(() => {
    const cat = categories.find((c) => c.slug === activeCategory);
    return cat?.name || "";
  }, [categories, activeCategory]);

  // Reset state when slug changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setPosts([]);
    setTag(null);
    setCategories([]);
    setPage(1);
    setActiveTab("newest");
    setActiveCategory(searchParams.get("category") || "");
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  const fetchTagContent = useCallback(async () => {
    if (!slug) return;

    setLoading(true);

    try {
      const res = await getPostsByTag(
        slug,
        page,
        activeTab,
        activeCategory || undefined,
      );

      if (res.status === "success") {
        setPosts(res.data);
        setTag(res.tag);
        setCategories(res.categories || []);
        setMeta(res.meta);
      } else {
        throw new Error(res.message || "Terjadi kesalahan sistem.");
      }
    } catch (err: unknown) {
      showBoundary(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [slug, page, activeTab, activeCategory, showBoundary]);

  // Fetch tag content when dependencies change
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchTagContent();
  }, [fetchTagContent]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleCategoryChange = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    setPage(1);
    setPosts([]);
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
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
        {/* Header */}
        <TagHeader
          tag={tag}
          totalPosts={meta?.total || 0}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Tabs */}
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

        {/* Loading */}
        {loading && <PostListSkeleton />}

        {/* Posts */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
            <p className="text-gray-500">
              {activeTab === "unanswered"
                ? "Tidak ada pertanyaan yang belum terjawab untuk tag ini."
                : "Belum ada postingan untuk tag ini."}
            </p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <TagPostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
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
        <TagInfoSidebar
          tag={tag}
          totalPosts={meta?.total || 0}
          activeCategoryName={activeCategoryName}
          relatedCategories={categories.map((cat) => ({
            ...cat,
            count: posts.filter((p) => p.category?.id === cat.id).length,
          }))}
          activeCategorySlug={activeCategory}
          onCategorySelect={handleCategoryChange}
          tagSlug={slug}
        />
      </aside>
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
