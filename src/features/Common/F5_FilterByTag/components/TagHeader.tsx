import { Hash } from 'lucide-react';
import type { Tag } from '../../../../types';

interface TagHeaderProps {
  tag: Tag;
  totalPosts: number;
}

export default function TagHeader({ tag, totalPosts }: TagHeaderProps) {
  // Gunakan hex_color dari database, jika null fallback ke Burnished Gold (#D4AF37)
  const tagColor = tag.hex_color || '#D4AF37';

  return (
    <div 
      className="bg-[#161618] border border-[#2A2A2C] rounded-xl p-6 mb-6 relative overflow-hidden"
      style={{ borderLeft: `4px solid ${tagColor}` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg bg-opacity-10 flex items-center justify-center"
              style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
            >
              <Hash className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-inter">
              {tag.name}
            </h1>
          </div>
          
          <p className="text-zinc-400 text-sm max-w-2xl font-inter leading-relaxed">
            {tag.description || `Kumpulan diskusi, pertanyaan, dan panduan seputar teknologi ${tag.name}.`}
          </p>
        </div>

        <div className="bg-[#0B0B0C] border border-[#2A2A2C] px-4 py-2 rounded-lg text-center min-w-[100px]">
          <span className="block text-xs text-zinc-500 font-medium uppercase tracking-wider font-inter">
            Postingan
          </span>
          <span className="text-xl font-bold text-[#D4AF37] font-fira-code">
            {totalPosts}
          </span>
        </div>
      </div>
    </div>
  );
}