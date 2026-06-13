// src/features/Admin/F9_UserManagement/components/TopEarnersList.tsx
import type { PointsSummaryEntry } from '../types';
import { Card, CardContent } from '../../../../components/ui/card';
import { TrendingUp } from 'lucide-react';
import { formatNumber } from '../../../../lib/utils';

interface TopEarnersListProps {
  earners: PointsSummaryEntry[];
}

export default function TopEarnersList({ earners }: TopEarnersListProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618]">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="text-sm font-semibold text-white">Top Reputation Earners Leaderboard</h2>
        </div>

        {earners.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-4">No data available.</p>
        ) : (
          <div className="space-y-3">
            {earners.slice(0, 10).map((entry, i) => (
              <div
                key={entry.user_id}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#2A2A2C] bg-[#0B0B0C]/50 hover:border-[#D4AF37]/30 transition-colors"
              >
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${
                  i === 0 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                  i === 1 ? 'bg-zinc-400/20 text-zinc-300' :
                  i === 2 ? 'bg-amber-700/20 text-amber-500' :
                  'bg-[#2A2A2C] text-gray-500'
                }`}>
                  {i + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-bold text-[10px]">
                      {entry.username.substring(0, 1).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white truncate">
                      {entry.username}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-[#D4AF37] font-fira-code">
                    {formatNumber(entry.total_points)}
                  </span>
                  <span className="block text-[9px] text-gray-600 uppercase tracking-wider">
                    {entry.actions_count} actions
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
