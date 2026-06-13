// src/features/Common/F5_FilterByTag/components/TagHeader.tsx

import { Link } from 'react-router-dom';
import { Hash, Bell, PenSquare, FolderOpen } from 'lucide-react';
import type { TagInfo, CategoryOption } from '../types';
import { Button } from '../../../../components/ui/button';

interface TagHeaderProps {
  tag: TagInfo | null;
  totalPosts: number;
  categories?: CategoryOption[];
  activeCategory?: string;
  onCategoryChange?: (slug: string) => void;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export default function TagHeader({
  tag,
  totalPosts,
  categories = [],
  activeCategory = '',
  onCategoryChange,
}: TagHeaderProps) {
  if (!tag) return null;

  const tagColor = tag.color || '#D4AF37';

  return (
    <div className="mb-6">
      {/* Top row: tag info + buttons */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Tag icon */}
          <div
            className="p-2.5 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
          >
            <Hash className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{tag.name}</h1>
            <span className="text-sm text-gray-500">{formatNumber(totalPosts)} questions</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="border-[#2A2A2C] text-gray-300 hover:bg-[#1A1A1C] hover:text-white text-xs h-9 bg-transparent gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            Follow Tag
          </Button>
          <Link to={`/posts/create?tag=${tag.slug}`}>
            <Button
              size="sm"
              className="bg-[#D4AF37] text-black hover:bg-[#c29f2f] text-xs font-bold h-9 gap-1.5"
            >
              <PenSquare className="w-3.5 h-3.5" />
              Tanya Seputar {tag.name}
            </Button>
          </Link>
        </div>
      </div>

      {/* Category filter chips */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-1">
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="font-medium">Category:</span>
          </div>

          {/* All chip */}
          <button
            onClick={() => onCategoryChange?.('')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
              !activeCategory
                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:border-[#D4AF37]/50 hover:text-gray-200'
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange?.(cat.slug)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
                activeCategory === cat.slug
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                  : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:border-[#D4AF37]/50 hover:text-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
