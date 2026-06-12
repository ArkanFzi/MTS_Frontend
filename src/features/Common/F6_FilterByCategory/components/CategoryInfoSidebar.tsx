// src/features/Common/F6_FilterByCategory/components/CategoryInfoSidebar.tsx

import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { FolderOpen, Hash, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CategoryInfo } from '../types';

interface RelatedTag {
  id: string;
  name: string;
  slug: string;
  color: string | null;
  count: number;
}

interface CategoryInfoSidebarProps {
  category: CategoryInfo | null;
  totalPosts: number;
  activeTagName?: string;
  relatedTags?: RelatedTag[];
  activeTagSlug?: string;
  categorySlug: string;
}

export default function CategoryInfoSidebar({
  category,
  totalPosts,
  activeTagName,
  relatedTags = [],
  activeTagSlug,
  categorySlug,
}: CategoryInfoSidebarProps) {
  if (!category) return null;

  return (
    <div className="space-y-4">
      {/* ── 1. About This Category ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-md flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37]">
            <FolderOpen className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-sm">About this category</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Category name</span>
            <Badge
              variant="outline"
              className="text-[11px] border-[#2A2A2C] text-[#D4AF37] border-[#D4AF37]/40"
            >
              <FolderOpen className="w-3 h-3 mr-1" />
              {category.name}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total posts</span>
            <span className="text-white font-medium">{totalPosts.toLocaleString('en-US')}</span>
          </div>
        </div>
      </Card>

      {/* ── 2. Top Suhu ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] p-5">
        <h3 className="font-semibold text-white text-sm mb-3">Top Suhu</h3>
        <p className="text-xs text-gray-500">Contributor rankings coming soon.</p>
      </Card>

      {/* ── 3. Related Tags ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] p-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2A2A2C]/50">
          <Hash className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-semibold text-white text-sm">Tag Terkait</h3>
        </div>

        <div className="flex flex-col gap-1.5">
          <Link
            to={`/categories/${categorySlug}`}
            className={`flex items-center justify-between px-3 py-2 text-xs rounded transition-all text-left ${
              !activeTagSlug
                ? 'bg-[#2A2A2C] text-[#D4AF37] font-semibold'
                : 'text-zinc-400 hover:bg-[#1A1A1C] hover:text-zinc-200'
            }`}
          >
            <span>Semua Tag</span>
            <Badge variant="outline" className="text-[10px] bg-[#1A1A1C] border-[#2A2A2C] text-zinc-500">
              {totalPosts}
            </Badge>
          </Link>

          {relatedTags.length > 0 ? (
            relatedTags.map((tag) => {
              const isActive = activeTagSlug === tag.slug;
              const tagColor = tag.color || '#D4AF37';
              return (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug}?category=${categorySlug}`}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded transition-all text-left ${
                    isActive
                      ? 'bg-[#2A2A2C] text-[#D4AF37] font-semibold'
                      : 'text-zinc-400 hover:bg-[#1A1A1C] hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-3 h-3 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-600'}`} />
                    <span className="line-clamp-1" style={isActive ? undefined : { color: tagColor }}>
                      {tag.name}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 h-4 border-[#2A2A2C] ${
                      isActive ? 'bg-[#161618] text-[#D4AF37]' : 'bg-[#1A1A1C] text-zinc-400'
                    }`}
                  >
                    {tag.count}
                  </Badge>
                </Link>
              );
            })
          ) : (
            <p className="text-xs text-zinc-500 p-2 text-center">Tidak ada tag terkait.</p>
          )}
        </div>
      </Card>

      {/* ── 4. Tag Rules ── */}
      {activeTagName && (
        <Card className="border-[#2A2A2C] bg-[#161618] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Hash className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-semibold text-white text-sm">{activeTagName} Rules</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] font-bold mt-0.5">1.</span>
              <span>Keep discussions relevant to both {category.name} and {activeTagName}.</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
