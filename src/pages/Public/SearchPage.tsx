import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { SearchResultItem } from '../../features/Common/F4_SearchPost/types';
import { fetchSearchPosts } from '../../features/Common/F4_SearchPost/api';
import { SearchBar } from '../../features/Common/F4_SearchPost/components/SearchBar';
import { Button } from '../../components/ui/button';
import { SearchResultCard } from '../../components/shared/SearchResultCard';


export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const query = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'terbaru';
  
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalFound, setTotalFound] = useState(0);

  useEffect(() => {
    const loadResults = async () => {
      if (!query) {
        setResults([]);
        setTotalFound(0);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetchSearchPosts({ q: query, page: 1 });
        setResults(response.data);
        setTotalFound(response.total); // Diambil dari PaginatedResponse global
      } catch (error) {
        console.error("Gagal mengambil data pencarian:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query, sort]);

  const handleSearchSubmit = (newKeyword: string) => {
    if (newKeyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(newKeyword)}&sort=${sort}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Area Search Bar */}
      <div className="mb-10">
        <SearchBar initialValue={query} onSearch={handleSearchSubmit} />
      </div>

      {/* Header Sorting & Result Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-gray-800 pb-4 gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 font-medium">SORT BY:</span>
          <div className="flex gap-2">
            <Button 
              variant={sort === 'terbaru' ? 'default' : 'outline'} 
              size="sm"
              className={`rounded-full px-4 text-xs ${sort === 'terbaru' ? 'bg-transparent border-[#D4AF37] text-[#D4AF37]' : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
              onClick={() => navigate(`/search?q=${query}&sort=terbaru`)}
            >
              Terbaru
            </Button>
            <Button 
              variant={sort === 'tertinggi' ? 'default' : 'outline'} 
              size="sm"
              className={`rounded-full px-4 text-xs ${sort === 'tertinggi' ? 'bg-transparent border-[#D4AF37] text-[#D4AF37]' : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
              onClick={() => navigate(`/search?q=${query}&sort=tertinggi`)}
            >
              Vote Tertinggi
            </Button>
          </div>
        </div>
        <span className="text-sm text-gray-400">{totalFound} results found</span>
      </div>

      {/* Area Render Hasil */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
          </div>
        ) : results.length > 0 ? (
          results.map((post) => (
            <SearchResultCard key={post.id} post={post} />
          ))
        ) : query ? (
          <p className="text-gray-500 text-center py-20">Tidak ada hasil yang ditemukan untuk "{query}"</p>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500">Ketik kata kunci di atas untuk mulai mencari referensi.</p>
          </div>
        )}
      </div>
      
      {/* Tombol Load More (Opsional, jika total melebihi limit per halaman) */}
      {results.length > 0 && results.length < totalFound && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-gray-800 text-[#D4AF37] hover:bg-gray-900">
             Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  );
}