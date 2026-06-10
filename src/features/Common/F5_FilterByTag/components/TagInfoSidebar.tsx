import { Calendar, Users, Star, MessageCircle, AlertCircle } from 'lucide-react';
import type { TagInfo } from '../types';
import { Card } from '../../../../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Button } from '../../../../components/ui/button';

interface TagInfoSidebarProps {
  tag: TagInfo | null;
  totalPosts: number;
  activeCategoryName?: string;
}

// Mock top contributors (placeholder until backend provides real data)
const MOCK_TOP_SUHU = [
  {
    id: '1',
    username: 'DanAbramov_Fan',
    avatar_url: null,
    reputation: 4502,
    answers: 142,
  },
  {
    id: '2',
    username: 'HookMaster',
    avatar_url: null,
    reputation: 3890,
    answers: 98,
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return n.toLocaleString('en-US');
  return String(n);
}

export default function TagInfoSidebar({ tag, totalPosts, activeCategoryName }: TagInfoSidebarProps) {
  if (!tag) return null;

  return (
    <div className="flex flex-col gap-4 sticky top-4">
      {/* ── Tag Information Card ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] py-0">
        <div className="p-4 border-b border-[#2A2A2C]">
          <h3 className="text-sm font-bold text-gray-300">Tag Information</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed">
            Kumpulan diskusi, pertanyaan, dan panduan seputar teknologi{' '}
            <span className="text-white font-medium">{tag.name}</span>.
          </p>

          {/* Separator */}
          <div className="border-t border-[#2A2A2C]" />

          {/* Created */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created</span>
            </div>
            <span className="text-white font-medium">{formatDate(tag.created_at)}</span>
          </div>

          {/* Followers / Usage */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-3.5 h-3.5" />
              <span>Followers</span>
            </div>
            <span className="text-white font-medium">{formatNumber(tag.usage_count)}</span>
          </div>

          {/* Total Posts */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Posts</span>
            </div>
            <span className="text-[#D4AF37] font-bold font-fira-code">{totalPosts}</span>
          </div>
        </div>
      </Card>

      {/* ── Category Rules Card ── */}
      {activeCategoryName && (
        <Card className="border-[#2A2A2C] bg-[#161618] py-0">
          <div className="p-4 border-b border-[#2A2A2C] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-gray-300">{activeCategoryName} Rules</h3>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <span className="text-[#D4AF37] text-xs font-bold mt-0.5">1</span>
              <p className="text-sm text-gray-400 leading-relaxed">
                Include specific version or engine details in your question title.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[#D4AF37] text-xs font-bold mt-0.5">2</span>
              <p className="text-sm text-gray-400 leading-relaxed">
                Provide code examples or schemas when asking for help.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-[#D4AF37] text-xs font-bold mt-0.5">3</span>
              <p className="text-sm text-gray-400 leading-relaxed">
                Avoid opinion-based questions without specific technical context.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Top Suhu Card ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] py-0">
        <div className="p-4 border-b border-[#2A2A2C]">
          <h3 className="text-sm font-bold text-gray-300">Top Suhu (Last 30 Days)</h3>
        </div>

        <div className="p-4 space-y-4">
          {MOCK_TOP_SUHU.map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-[#2A2A2C]">
                {user.avatar_url ? (
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                ) : null}
                <AvatarFallback className="bg-[#D4AF37] text-black text-xs font-bold">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-blue-400 hover:text-blue-300 cursor-pointer truncate block">
                  {user.username}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-[#D4AF37]">
                  <Star className="w-3 h-3 fill-[#D4AF37]" />
                  <span className="font-medium">{formatNumber(user.reputation)} Rep</span>
                </div>
              </div>

              <div className="bg-[#0B0B0C] border border-[#2A2A2C] px-2.5 py-1 rounded text-[11px] text-gray-300 font-medium whitespace-nowrap">
                {user.answers} answers
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <Button
            variant="outline"
            className="w-full border-[#2A2A2C] text-gray-300 hover:bg-[#1A1A1C] hover:text-white text-xs h-9 bg-transparent"
          >
            View All Experts
          </Button>
        </div>
      </Card>
    </div>
  );
}
