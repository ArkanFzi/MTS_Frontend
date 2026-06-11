// src/features/Common/F5_FilterByTag/components/TagInfoSidebar.tsx

import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Info, Hash, FolderOpen, ChevronRight } from 'lucide-react';
import type { TagInfo } from '../types';

// Interface untuk menampung kategori unik yang diekstrak dari postingan
interface RelatedCategory {
  id: number | string;
  name: string;
  slug: string;
  count: number; // Menghitung berapa kali kategori ini muncul di tag tersebut
}

interface TagInfoSidebarProps {
  tag: TagInfo | null;
  totalPosts: number;
  activeCategoryName?: string;
  
  // Tambahkan props untuk menerima kategori hasil ekstrak
  relatedCategories?: RelatedCategory[];
  activeCategorySlug?: string;
  onCategorySelect?: (slug: string) => void;
}

export default function TagInfoSidebar({ 
  tag, 
  totalPosts, 
  activeCategoryName,
  relatedCategories = [],
  activeCategorySlug,
  onCategorySelect
}: TagInfoSidebarProps) {
  
  if (!tag) return null;

  const tagColor = tag.color || '#D4AF37';

  return (
    <div className="space-y-4">
      {/* ── 1. About This Tag ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] p-5">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="p-1.5 rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
          >
            <Info className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-white text-sm">About this tag</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tag name</span>
            <Badge
              variant="outline"
              className="text-[11px] border-[#2A2A2C] font-fira-code"
              style={{ color: tagColor, borderColor: `${tagColor}40` }}
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag.name}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total posts</span>
            <span className="text-white font-medium">{totalPosts.toLocaleString('en-US')}</span>
          </div>
          {tag.usage_count !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Usage count</span>
              <span className="text-white font-medium">{tag.usage_count}</span>
            </div>
          )}
        </div>
      </Card>

      {/* ── 2. Top Suhu ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] p-5">
        <h3 className="font-semibold text-white text-sm mb-3">Top Suhu</h3>
        <p className="text-xs text-gray-500">Contributor rankings coming soon.</p>
      </Card>

      {/* ── 3. TAMPILKAN KATEGORI YANG COCOK DENGAN TAG (Baru) ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] p-5">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#2A2A2C]/50">
          <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-semibold text-white text-sm">Kategori Terkait</h3>
        </div>

        <div className="flex flex-col gap-1.5">
          {/* Tombol Reset Filter / Semua Kategori */}
          <button
            onClick={() => onCategorySelect?.('')}
            className={`flex items-center justify-between px-3 py-2 text-xs rounded transition-all text-left ${
              !activeCategorySlug 
                ? 'bg-[#2A2A2C] text-[#D4AF37] font-semibold' 
                : 'text-zinc-400 hover:bg-[#1A1A1C] hover:text-zinc-200'
            }`}
          >
            <span>Semua Kategori</span>
            <Badge variant="outline" className="text-[10px] bg-[#1A1A1C] border-[#2A2A2C] text-zinc-500">
              {totalPosts}
            </Badge>
          </button>

          {/* Menampilkan daftar kategori unik yang berelasi */}
          {relatedCategories.length > 0 ? (
            relatedCategories.map((cat) => {
              const isActive = activeCategorySlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategorySelect?.(cat.slug)}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded transition-all text-left ${
                    isActive 
                      ? 'bg-[#2A2A2C] text-[#D4AF37] font-semibold' 
                      : 'text-zinc-400 hover:bg-[#1A1A1C] hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ChevronRight className={`w-3 h-3 ${isActive ? 'text-[#D4AF37]' : 'text-zinc-600'}`} />
                    <span className="line-clamp-1">{cat.name}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] px-1.5 h-4 border-[#2A2A2C] ${
                      isActive ? 'bg-[#161618] text-[#D4AF37]' : 'bg-[#1A1A1C] text-zinc-400'
                    }`}
                  >
                    {cat.count}
                  </Badge>
                </button>
              );
            })
          ) : (
            <p className="text-xs text-zinc-500 p-2 text-center">Tidak ada kategori terkait.</p>
          )}
        </div>
      </Card>

      {/* ── 4. Category Rules ── */}
      {activeCategoryName && (
        <Card className="border-[#2A2A2C] bg-[#161618] p-5">
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="font-semibold text-white text-sm">{activeCategoryName} Rules</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] font-bold mt-0.5">1.</span>
              <span>Keep discussions relevant to both {tag.name} and {activeCategoryName}.</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}