import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import {
  fetchSearchPosts,
  fetchCategories,
} from "../../features/Common/F4_SearchPost/api";
import type { SearchResultItem } from "../../features/Common/F4_SearchPost/types";
import { SearchBar } from "../../features/Common/F4_SearchPost/components/SearchBar";
import { SearchResultCard } from "../../components/shared/SearchResultCard";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import ResponsiveLayout from "../../components/shared/ResponsiveLayout";

function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-5 p-5 bg-[#161618] border border-[#2A2A2C] rounded-lg"
        >
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <Skeleton className="w-10 h-6" />
            <Skeleton className="w-8 h-3" />
            <Skeleton className="w-8 h-3" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "terbaru";
  const categoryFilter = searchParams.get("category") || "";

  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState<SearchResultItem[]>([]);

  // ── Fetch search results (always enabled — shows all posts when no query) ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", query, sort, categoryFilter, page],
    queryFn: () =>
      fetchSearchPosts({
        q: query,
        page,
        sort,
        category: categoryFilter || undefined,
      }),
  });

  // ── Fetch categories for filter chips ──
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 min cache
  });

  const categories = categoriesData?.data || [];

  // ── Accumulate results safely in useEffect (no render-time mutation) ──
  useEffect(() => {
    if (!data?.data) return;
    const newEntries = data.data;

    setAllResults((prev) => {
      if (page === 1) return newEntries;
      // Append new page entries, avoiding duplicates
      const prevCount = (page - 1) * (data.meta?.per_page || 10);
      const base = prev.slice(0, prevCount);
      return [...base, ...newEntries];
    });
  }, [data, page]);

  // ── Derived state ──
  const results = data?.data || [];
  const meta = data?.meta;
  const totalFound = meta?.total || 0;
  const hasMore = meta ? meta.current_page < meta.last_page : false;
  const displayResults = page === 1 ? results : allResults;

  // ── Handlers ──
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    setPage(1);
    setAllResults([]);
    navigate(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (newKeyword: string) => {
    updateParams({ q: newKeyword.trim(), sort, category: categoryFilter });
  };

  const handleSortChange = (newSort: string) => {
    updateParams({ q: query, sort: newSort, category: categoryFilter });
  };

  const handleCategoryChange = (slug: string) => {
    const newCategory = categoryFilter === slug ? "" : slug;
    updateParams({ q: query, sort, category: newCategory });
  };

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-[#D4AF37]" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Search Posts
            </h1>
          </div>
          <p className="text-sm text-gray-400 ml-9">
            Cari postingan, error, atau topik dari komunitas.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="mb-6">
          <SearchBar initialValue={query} onSearch={handleSearchSubmit} />
        </div>

        {/* ── Category Filter Chips ── */}
        {categories.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Filter by Category
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className={`cursor-pointer text-[11px] px-3 py-1 h-auto transition-colors ${
                  !categoryFilter
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                    : "bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:text-white hover:border-gray-600"
                }`}
                onClick={() => handleCategoryChange("")}
              >
                All
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant="outline"
                  className={`cursor-pointer text-[11px] px-3 py-1 h-auto transition-colors ${
                    categoryFilter === cat.slug
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40"
                      : "bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:text-white hover:border-gray-600"
                  }`}
                  onClick={() => handleCategoryChange(cat.slug)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* ── Sort + Results Count Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 border-b border-[#2A2A2C] pb-4 gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Sort:
            </span>
            <div className="flex gap-2">
              <Button
                variant={sort === "terbaru" ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 text-xs ${
                  sort === "terbaru"
                    ? "bg-transparent border-[#D4AF37] text-[#D4AF37]"
                    : "border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent"
                }`}
                onClick={() => handleSortChange("terbaru")}
              >
                Terbaru
              </Button>
              <Button
                variant={sort === "tertinggi" ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-4 text-xs ${
                  sort === "tertinggi"
                    ? "bg-transparent border-[#D4AF37] text-[#D4AF37]"
                    : "border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent"
                }`}
                onClick={() => handleSortChange("tertinggi")}
              >
                Vote Tertinggi
              </Button>
            </div>
          </div>
          <span className="text-sm text-gray-400">
            {totalFound} results found
          </span>
        </div>

        {/* ── Results ── */}
        <div className="flex flex-col gap-4">
          {isLoading && page === 1 && <ResultsSkeleton />}

          {!isLoading &&
            !isError &&
            displayResults.length > 0 &&
            displayResults.map((post) => (
              <SearchResultCard key={post.id} post={post} />
            ))}

          {!isLoading && !isError && results.length === 0 && (
            <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
              {query ? (
                <p className="text-gray-500">
                  Tidak ada hasil yang ditemukan untuk "
                  <span className="text-white">{query}</span>"
                </p>
              ) : (
                <p className="text-gray-500">
                  Belum ada postingan. Coba cari dengan kata kunci tertentu.
                </p>
              )}
            </div>
          )}

          {isError && (
            <p className="text-red-400 text-center py-20">
              Gagal memuat hasil pencarian. Silakan coba lagi.
            </p>
          )}
        </div>

        {/* ── Load More ── */}
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
    </ResponsiveLayout>
  );
}
