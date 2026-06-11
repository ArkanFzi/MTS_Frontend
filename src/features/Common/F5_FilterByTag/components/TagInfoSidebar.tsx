// src/features/Common/F5_FilterByTag/components/TagInfoSidebar.tsx

import { Card } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Info, Hash, FolderOpen } from 'lucide-react';
import type { TagInfo } from '../types';

interface TagInfoSidebarProps {
  tag: TagInfo | null;
  totalPosts: number;
  activeCategoryName?: string;
}

export default function TagInfoSidebar({ tag, totalPosts, activeCategoryName }: TagInfoSidebarProps) {
  if (!tag) return null;

  const tagColor = tag.color || '#D4AF37';

  return (
    <div className="space-y-4">
      {/* Tag Info Card */}
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

      {/* Top Contributors (placeholder) */}
      <Card className="border-[#2A2A2C] bg-[#161618] p-5">
        <h3 className="font-semibold text-white text-sm mb-3">Top Suhu</h3>
        <p className="text-xs text-gray-500">Contributor rankings coming soon.</p>
      </Card>

      {/* Category Rules (shown when category is active) */}
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
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] font-bold mt-0.5">2.</span>
              <span>Provide code examples when asking technical questions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#D4AF37] font-bold mt-0.5">3.</span>
              <span>Mark the best answer to help future readers.</span>
            </li>
          </ul>
        </Card>
      )}
    </div>
  );
}
