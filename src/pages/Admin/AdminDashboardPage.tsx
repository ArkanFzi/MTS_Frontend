// src/pages/Admin/AdminDashboardPage.tsx
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Users, FileText, MessageSquare, Tag,
  Award, FolderOpen, TrendingUp,
} from 'lucide-react';
import { getAdminStats, getPointsSummary } from '../../features/Admin/F9_UserManagement/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent } from '../../components/ui/card';

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  subtitle?: string;
}

function StatCard({ icon, label, value, color, subtitle }: StatCardProps) {
  return (
    <Card className="border-[#2A2A2C] bg-[#161618] hover:border-[#D4AF37]/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-bold font-fira-code ${color}`}>{formatNumber(value)}</p>
            {subtitle && <p className="text-[10px] text-gray-600 mt-1">{subtitle}</p>}
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#0B0B0C] border border-[#2A2A2C] flex items-center justify-center text-gray-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
  });

  const { data: pointsData, isLoading: pointsLoading } = useQuery({
    queryKey: ['admin-points'],
    queryFn: getPointsSummary,
  });

  const stats = statsData?.data;
  const topEarners = Array.isArray(pointsData?.data) ? pointsData.data : [];

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-6 text-center">
        <p className="text-red-400 text-sm">Failed to load dashboard statistics.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-6 h-6 text-[#D4AF37]" />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Platform overview and statistics</p>
        </div>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Users"
          value={stats.total_users}
          color="text-blue-400"
          subtitle={`+${stats.new_users_today} today`}
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Total Posts"
          value={stats.total_posts}
          color="text-[#D4AF37]"
          subtitle={`+${stats.new_posts_today} today`}
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Total Comments"
          value={stats.total_comments}
          color="text-green-400"
        />
        <StatCard
          icon={<FolderOpen className="w-5 h-5" />}
          label="Categories"
          value={stats.total_categories}
          color="text-purple-400"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Tag className="w-5 h-5" />}
          label="Tags"
          value={stats.total_tags}
          color="text-amber-400"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Badges"
          value={stats.total_badges}
          color="text-pink-400"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="New Users Today"
          value={stats.new_users_today}
          color="text-emerald-400"
        />
      </div>

      {/* Top earners section */}
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="text-sm font-semibold text-white">Top Reputation Earners</h2>
          </div>

          {pointsLoading ? (
            <div className="py-6 flex justify-center">
              <LoadingSpinner size="sm" text="Loading..." />
            </div>
          ) : topEarners.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-4">No data available.</p>
          ) : (
            <div className="space-y-3">
              {topEarners.slice(0, 10).map((entry, i) => (
                <div
                  key={entry.user_id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#2A2A2C] bg-[#0B0B0C]/50 hover:border-[#D4AF37]/30 transition-colors"
                >
                  {/* Rank */}
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${
                    i === 0 ? 'bg-[#D4AF37]/20 text-[#D4AF37]' :
                    i === 1 ? 'bg-zinc-400/20 text-zinc-300' :
                    i === 2 ? 'bg-amber-700/20 text-amber-500' :
                    'bg-[#2A2A2C] text-gray-500'
                  }`}>
                    {i + 1}
                  </span>

                  {/* User info */}
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

                  {/* Points */}
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
    </div>
  );
}
