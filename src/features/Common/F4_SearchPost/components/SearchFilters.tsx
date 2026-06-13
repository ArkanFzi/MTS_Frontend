// src/features/Common/F4_SearchPost/components/SearchFilters.tsx
import { SlidersHorizontal } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SearchFiltersProps {
  categories: Category[];
  categoryFilter: string;
  sort: string;
  totalFound: number;
  onCategoryChange: (slug: string) => void;
  onSortChange: (sort: string) => void;
}

export default function SearchFilters({
  categories,
  categoryFilter,
  sort,
  totalFound,
  onCategoryChange,
  onSortChange,
}: SearchFiltersProps) {
  return (
    <>
      {/* Category Filter Chips */}
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
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40'
                  : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:text-white hover:border-gray-600'
              }`}
              onClick={() => onCategoryChange('')}
            >
              All
            </Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant="outline"
                className={`cursor-pointer text-[11px] px-3 py-1 h-auto transition-colors ${
                  categoryFilter === cat.slug
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40'
                    : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:text-white hover:border-gray-600'
                }`}
                onClick={() => onCategoryChange(cat.slug)}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Sort + Results Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 border-b border-[#2A2A2C] pb-4 gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sort:</span>
          <div className="flex gap-2">
            <Button
              variant={sort === 'terbaru' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-4 text-xs ${
                sort === 'terbaru'
                  ? 'bg-transparent border-[#D4AF37] text-[#D4AF37]'
                  : 'border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent'
              }`}
              onClick={() => onSortChange('terbaru')}
            >
              Terbaru
            </Button>
            <Button
              variant={sort === 'tertinggi' ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full px-4 text-xs ${
                sort === 'tertinggi'
                  ? 'bg-transparent border-[#D4AF37] text-[#D4AF37]'
                  : 'border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent'
              }`}
              onClick={() => onSortChange('tertinggi')}
            >
              Vote Tertinggi
            </Button>
          </div>
        </div>
        <span className="text-sm text-gray-400">{totalFound} results found</span>
      </div>
    </>
  );
}
