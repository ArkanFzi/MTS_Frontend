// src/features/Common/F6_FilterByCategory/components/CategoryHeader.tsx

import { Link } from 'react-router-dom';
import { FolderOpen, PenSquare, Hash } from 'lucide-react';
import type { CategoryInfo, CategoryTagOption } from '../types';
import { Button } from '../../../../components/ui/button';

interface CategoryHeaderProps {
  category: CategoryInfo | null;
  totalPosts: number;
  tags?: CategoryTagOption[];
  activeTag?: string;
  onTagChange?: (slug: string) => void;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export default function CategoryHeader({
  category,
  totalPosts,
  tags = [],
  activeTag = '',
  onTagChange,
}: CategoryHeaderProps) {
  if (!category) return null;

  return (
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37]">
            <FolderOpen className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{category.name}</h1>
            <span className="text-sm text-gray-500">{formatNumber(totalPosts)} questions</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to={`/posts/create?category=${category.slug}${activeTag ? `&tag=${activeTag}` : ''}`}>
            <Button
              size="sm"
              className="bg-[#D4AF37] text-black hover:bg-[#c29f2f] text-xs font-bold h-9 gap-1.5"
            >
              <PenSquare className="w-3.5 h-3.5" />
              Tanya di {category.name}
            </Button>
          </Link>
        </div>
      </div>

      {category.description && (
        <p className="text-sm text-gray-400 mb-4">{category.description}</p>
      )}

      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-1">
            <Hash className="w-3.5 h-3.5" />
            <span className="font-medium">Tag:</span>
          </div>

          <button
            onClick={() => onTagChange?.('')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
              !activeTag
                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:border-[#D4AF37]/50 hover:text-gray-200'
            }`}
          >
            All
          </button>

          {tags.map((tag) => {
            const tagColor = tag.color || '#D4AF37';
            return (
              <button
                key={tag.id}
                onClick={() => onTagChange?.(tag.slug)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors border ${
                  activeTag === tag.slug
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C] hover:border-[#D4AF37]/50 hover:text-gray-200'
                }`}
                style={activeTag === tag.slug ? undefined : { color: tagColor }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
