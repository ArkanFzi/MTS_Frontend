// F6_FilterByCategory/components/CategoryList.tsx
import React from 'react';
import { Tag } from 'lucide-react';

// Data kategori dummy untuk preview tampilan
const MOCK_CATEGORIES = [
  { id: 1, name: 'UI/UX Design', slug: 'ui-ux' },
  { id: 2, name: 'Motion Graphics', slug: 'motion' },
  { id: 3, name: 'Video Editing', slug: 'video' },
  { id: 4, name: 'Web Development', slug: 'web' },
];

interface CategoryListProps {
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
}

export default function CategoryList({ selectedCategory, onCategoryChange }: CategoryListProps) {
  return (
    <div className="px-6 py-4 bg-[#111112] border-b border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
      {/* Tombol Semua Topik */}
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-1.5 text-xs font-medium tracking-tight border transition-all shrink-0 rounded-md ${
          selectedCategory === 'all'
            ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-[2px_2px_0px_0px_rgba(212,175,55,0.3)]'
            : 'bg-[#0B0B0C] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
        }`}
      >
        Semua Topik
      </button>
      
      {/* Tombol List Kategori */}
      {MOCK_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.slug)}
          className={`px-4 py-1.5 text-xs font-medium tracking-tight border transition-all shrink-0 flex items-center gap-1.5 rounded-md ${
            selectedCategory === cat.slug
              ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-[2px_2px_0px_0px_rgba(212,175,55,0.3)]'
              : 'bg-[#0B0B0C] text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
          }`}
        >
          <Tag className="h-3 w-3 opacity-70" />
          {cat.name}
        </button>
      ))}
    </div>
  );
}