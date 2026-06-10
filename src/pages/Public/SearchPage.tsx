import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSearchPosts } from '../../features/Common/F4_SearchPost/api';
import { SearchBar } from '../../features/Common/F4_SearchPost/components/SearchBar';
import { Button } from '../../components/ui/button';
import { SearchResultCard } from '../../components/shared/SearchResultCard';
import { useState } from 'react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'terbaru';
  
  const [page, setPage] = useState(1);
  const [allResults, setAllResults] = useState<any[]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query, sort, page],
    queryFn: () => fetchSearchPosts({ q: query, page, sort }),
    enabled: !!query,
  });

  // Reset page when query/sort changes
  const prevQuery = useSearchParams()[0].toString();
  if (page !== 1 && searchParams.get('q') && searchParams.get('sort')) {
    // handled by query key
  }

  // Accumulate results for "load more" pattern
  const results = data?.data || [];
  const meta = (data as any)?.meta;
  const totalFound = meta?.total || 0;
  const hasMore = meta ? meta.current_page < meta.last_page : false;

  const displayResults = page === 1 ? results : [...allResults, ...results];

  if (page === 1 && data) {
    if (JSON.stringify(allResults) !== JSON.stringify(results)) {
      setAllResults(results);
    }
  } else if (page > 1 && data) {
    const combined = [...allResults, ...results];
    if (combined.length !== allResults.length) {
      setAllResults(combined);
    }
  }

  // Reset when query changes
  const handleSearchSubmit = (newKeyword: string) => {
    if (newKeyword.trim()) {
      setPage(1);
      setAllResults([]);
      navigate(`/search?q=${encodeURIComponent(newKeyword)}&sort=${sort}`);
    }
  };

  const handleSortChange = (newSort: string) => {
    setPage(1);
    setAllResults([]);
    navigate(`/search?q=${query}&sort=${newSort}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-10">
        <SearchBar initialValue={query} onSearch={handleSearchSubmit} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-gray-800 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 font-medium">SORT BY:</span>
          <div className="flex gap-2">
            <Button 
              variant={sort === 'terbaru' ? 'default' : 'outline'} 
              size="sm"
              className={`rounded-full px-4 text-xs ${sort === 'terbaru' ? 'bg-transparent border-[#D4AF37] text-[#D4AF37]' : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
              onClick={() => handleSortChange('terbaru')}
            >
              Terbaru
            </Button>
            <Button 
              variant={sort === 'tertinggi' ? 'default' : 'outline'} 
              size="sm"
              className={`rounded-full px-4 text-xs ${sort === 'tertinggi' ? 'bg-transparent border-[#D4AF37] text-[#D4AF37]' : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
              onClick={() => handleSortChange('tertinggi')}
            >
              Vote Tertinggi
            </Button>
          </div>
        </div>
        <span className="text-sm text-gray-400">{totalFound} results found</span>
      </div>

      <div className="flex flex-col gap-4">
        {displayResults.length > 0 ? (
          displayResults.map((post) => (
            <SearchResultCard key={post.id} post={post} />
          ))
        ) : isLoading ? (
          null
        ) : query ? (
          <p className="text-gray-500 text-center py-20">Tidak ada hasil yang ditemukan untuk "{query}"</p>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Ketik kata kunci di atas untuk mulai mencari referensi.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          </div>
        )}

        {isError && (
          <p className="text-red-400 text-center py-10">Gagal memuat hasil pencarian. Silakan coba lagi.</p>
        )}
      </div>
      
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            className="border-gray-800 text-[#D4AF37] hover:bg-gray-900"
            onClick={() => setPage(p => p + 1)}
          >
             Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  );
}
