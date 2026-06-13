// src/pages/Admin/AdminDashboardPage.tsx
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Users, FileText, MessageSquare, Tag,
  Award, FolderOpen, TrendingUp,
} from 'lucide-react';

import { getAdminStats, getPointsSummary, getActivityChart } from '../../features/Admin/F9_UserManagement/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import StatCard from '../../features/Admin/F9_UserManagement/components/StatCard';
import ActivityChart from '../../features/Admin/F9_UserManagement/components/ActivityChart';
import ReputationChart from '../../features/Admin/F9_UserManagement/components/ReputationChart';
import TopEarnersList from '../../features/Admin/F9_UserManagement/components/TopEarnersList';

export default function AdminDashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
  });

  const { data: pointsData, isLoading: pointsLoading } = useQuery({
    queryKey: ['admin-points'],
    queryFn: getPointsSummary,
  });

  const { data: chartData } = useQuery({
    queryKey: ['admin-activity-chart'],
    queryFn: getActivityChart,
  });

  const stats = statsData?.data;
  const topEarners = Array.isArray(pointsData?.data) ? pointsData.data : [];
  const activityData = Array.isArray(chartData?.data) ? chartData.data : [];

  if (statsLoading || pointsLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <LoadingSpinner size="lg" text="Loading dashboard analytics..." />
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
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Users" value={stats.total_users} color="text-blue-400" subtitle={`+${stats.new_users_today} today`} />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Total Posts" value={stats.total_posts} color="text-[#D4AF37]" subtitle={`+${stats.new_posts_today} today`} />
        <StatCard icon={<MessageSquare className="w-5 h-5" />} label="Total Comments" value={stats.total_comments} color="text-green-400" />
        <StatCard icon={<FolderOpen className="w-5 h-5" />} label="Categories" value={stats.total_categories} color="text-purple-400" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Tag className="w-5 h-5" />} label="Tags" value={stats.total_tags} color="text-amber-400" />
        <StatCard icon={<Award className="w-5 h-5" />} label="Badges" value={stats.total_badges} color="text-pink-400" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="New Users Today" value={stats.new_users_today} color="text-emerald-400" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <ActivityChart data={activityData} totalPosts={stats.total_posts} totalComments={stats.total_comments} />
        <ReputationChart topEarners={topEarners} />
      </div>

      {/* Top earners list */}
      <TopEarnersList earners={topEarners} />
    </div>
  );
}
