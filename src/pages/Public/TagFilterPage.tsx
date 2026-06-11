// src/pages/Public/TagFilterPage.tsx

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { Skeleton } from "../../components/ui/skeleton";

type SortTab = "newest" | "bountied" | "unanswered";

const TABS: { key: SortTab; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "bountied", label: "Bountied" },
  { key: "unanswered", label: "Unanswered" },
];

function PostListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-4 p-5 bg-[#161618] border border-[#2A2A2C] rounded-lg"
        >
          <div className="flex flex-col items-center gap-2 min-w-[70px]">
            <Skeleton className="w-8 h-6" />
            <Skeleton className="w-16 h-12" />
            <Skeleton className="w-16 h-12" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
            <div className="flex gap-2">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({
  current,
  last,
  onPageChange,
}: {
  current: number;
  last: number;
  onPageChange: (page: number) => void;
}) {
  if (last <= 1) return null;

  const pages: (number | string)[] = [];
  const delta = 2;

  for (let i = 1; i <= last; i++) {
    if (
      i === 1 ||
      i === last ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 pb-8">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1.5 text-xs font-medium border border-[#2A2A2C] rounded text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-xs font-medium border rounded transition-colors min-w-[32px] ${
              p === current
                ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold"
                : "border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent"
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="px-1 text-gray-500">
            ...
          </span>
        ),
      )}

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === last}
        className="px-3 py-1.5 text-xs font-medium border border-[#2A2A2C] rounded text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

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

  // Reset when slug changes
  useEffect(() => {
    setPosts([]);
    setTag(null);
    setCategories([]);
    setPage(1);
    setActiveTab("newest");
    setActiveCategory(searchParams.get("category") || "");
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

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
    } catch (err: any) {
      showBoundary(err);
    } finally {
      setLoading(false);
    }
  }, [slug, page, activeTab, activeCategory, showBoundary]);

  useEffect(() => {
    fetchTagContent();
  }, [fetchTagContent]);

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
            {posts.map((post, index) => (
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
          // ⚡ Tambahkan 3 props baru ini untuk mengalirkan data ke sidebar
          relatedCategories={categories.map((cat) => ({
            ...cat,
            // Menghitung berapa banyak postingan di page saat ini yang memakai kategori ini
            count: posts.filter((p) => p.category?.id === cat.id).length,
          }))}
          activeCategorySlug={activeCategory}
          onCategorySelect={handleCategoryChange}
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
