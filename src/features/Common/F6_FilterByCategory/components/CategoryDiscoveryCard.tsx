// src/features/Common/F6_FilterByCategory/components/CategoryDiscoveryCard.tsx

import { Link } from 'react-router-dom';
import { Hash, FolderOpen } from 'lucide-react';
import type { CategoryWithTags } from '../types';
import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

interface CategoryDiscoveryCardProps {
  category: CategoryWithTags;
}

export default function CategoryDiscoveryCard({ category }: CategoryDiscoveryCardProps) {
  const hasTags = category.tags.length > 0;

  return (
    <Card className="border-[#2A2A2C] bg-[#161618] p-5 hover:border-[#D4AF37]/40 transition-all flex flex-col h-full">
      {/* Category header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="p-2 bg-[#0B0B0C] rounded-lg text-[#D4AF37] flex-shrink-0">
          <FolderOpen className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-white text-sm leading-tight">{category.name}</h2>
          <span className="text-xs text-gray-500">{formatNumber(category.post_count)} posts</span>
        </div>
      </div>

      {/* Description */}
      {category.description && (
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {category.description}
        </p>
      )}

      {/* Tags */}
      {hasTags ? (
        <div className="mt-auto pt-3 border-t border-[#2A2A2C]">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium mb-2">
            Popular tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {category.tags.map((tag) => {
              const tagColor = tag.color || '#D4AF37';
              return (
                <Link
                  key={tag.id}
                  to={`/tags/${tag.slug}?category=${category.slug}`}
                  className="group/tag inline-flex items-center gap-1"
                >
                  <Badge
                    variant="outline"
                    className="text-[11px] bg-[#1A1A1C] border-[#2A2A2C] text-gray-300 font-medium cursor-pointer group-hover/tag:border-[#D4AF37]/50 group-hover/tag:text-[#D4AF37] transition-colors gap-1"
                  >
                    <Hash className="w-3 h-3" style={{ color: tagColor }} />
                    {tag.name}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-3 border-t border-[#2A2A2C]">
          <Link
            to="/tags"
            className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors"
          >
            Browse all tags →
          </Link>
        </div>
      )}
    </Card>
  );
}
