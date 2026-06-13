import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Search } from 'lucide-react';
import { fetchSearchPosts, fetchCategories } from '../../features/Common/F4_SearchPost/api';
import type { SearchResultItem } from '../../features/Common/F4_SearchPost/types';
import { SearchBar } from '../../features/Common/F4_SearchPost/components/SearchBar';
import { SearchResultCard } from '../../components/shared/SearchResultCard';
import { Button } from '../../components/ui/button';
import SearchFilters from '../../features/Common/F4_SearchPost/components/SearchFilters';
import { ResultsSkeleton } from '../../features/Common/F4_SearchPost/components/ResultsSkeleton';


export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'terbaru';
  const categoryFilter = searchParams.get('category') || '';

  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState<SearchResultItem[]>([]);

  // ── Fetch search results (always enabled — shows all posts when no query) ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query, sort, categoryFilter, page],
    queryFn: () => fetchSearchPosts({ q: query, page, sort, category: categoryFilter || undefined }),
  });

  // ── Fetch categories for filter chips ──
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
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
    const newCategory = categoryFilter === slug ? '' : slug;
    updateParams({ q: query, sort, category: newCategory });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* ── Header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Search className="w-6 h-6 text-[#D4AF37]" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Search Posts</h1>
        </div>
        <p className="text-sm text-gray-400 ml-9">
          Cari postingan, error, atau topik dari komunitas.
        </p>
      </div>

      {/* ── Search Bar ── */}
      <div className="mb-6">
        <SearchBar initialValue={query} onSearch={handleSearchSubmit} />
      </div>

      {/* ── Search Filters ── */}
      <SearchFilters
        categories={categories}
        categoryFilter={categoryFilter}
        sort={sort}
        totalFound={totalFound}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

      {/* ── Results ── */}
      <div className="flex flex-col gap-4">
        {isLoading && page === 1 && <ResultsSkeleton />}

        {!isLoading && !isError && displayResults.length > 0 && (
          displayResults.map((post) => (
            <SearchResultCard key={post.id} post={post} />
          ))
        )}

        {!isLoading && !isError && results.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
            {query ? (
              <p className="text-gray-500">
                Tidak ada hasil yang ditemukan untuk "<span className="text-white">{query}</span>"
              </p>
            ) : (
              <p className="text-gray-500">Belum ada postingan. Coba cari dengan kata kunci tertentu.</p>
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
  );
}
