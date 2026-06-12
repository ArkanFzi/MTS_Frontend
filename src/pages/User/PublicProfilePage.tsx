// src/pages/User/PublicProfilePage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Award, FileText, Users, TrendingUp, Flag } from 'lucide-react';
import { getUserProfile } from '../../features/User/F25_FollowUser/api';
import FollowButton from '../../features/User/F25_FollowUser/components/FollowButton';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import ReportUserModal from '../../features/User/F30_UserReport/components/ReportUserModal';

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Role badge config
function getRoleBadge(roles: string[]) {
  if (roles.includes('admin')) return { label: 'Admin', color: 'bg-red-950/50 text-red-400 border-red-900' };
  if (roles.includes('moderator')) return { label: 'Moderator', color: 'bg-blue-950/50 text-blue-400 border-blue-900' };
  return { label: 'Member', color: 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]' };
}

function getReputationTier(points: number) {
  if (points >= 10000) return { label: 'Legendary', color: 'text-[#D4AF37]' };
  if (points >= 5000) return { label: 'Expert', color: 'text-purple-400' };
  if (points >= 1000) return { label: 'Advanced', color: 'text-blue-400' };
  if (points >= 100) return { label: 'Intermediate', color: 'text-green-400' };
  return { label: 'Beginner', color: 'text-gray-400' };
}

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();
  const [showReport, setShowReport] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => getUserProfile(id!),
    enabled: !!id,
  });

  const profile = data?.data;
  const isOwnProfile = currentUser?.id === profile?.id;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="flex items-start gap-6 mb-8">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-32 h-5" />
            <Skeleton className="w-64 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !profile) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 text-center">
        <p className="text-gray-400 text-lg mb-2">User not found.</p>
        <p className="text-gray-600 text-sm">This profile may have been removed or doesn't exist.</p>
      </div>
    );
  }

  const roleBadge = getRoleBadge(profile.roles || []);
  const repTier = getReputationTier(profile.reputation_points);

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* ── Profile Header ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <Avatar className="w-24 h-24 border-2 border-[#2A2A2C]">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
              ) : null}
              <AvatarFallback className="bg-[#D4AF37] text-black text-2xl font-bold">
                {profile.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
                <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${roleBadge.color}`}>
                  {roleBadge.label}
                </Badge>
                <span className={`text-xs font-semibold ${repTier.color}`}>
                  {repTier.label}
                </span>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-400 mt-2 mb-3 max-w-lg leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {timeAgo(profile.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Level {profile.level}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2">
              {!isOwnProfile && (
                <FollowButton
                  userId={profile.id}
                  initialIsFollowing={profile.is_following ?? false}
                  initialFollowersCount={profile.followers_count}
                />
              )}
              {currentUser && !isOwnProfile && (
                <button
                  onClick={() => setShowReport(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-red-400 transition-colors"
                >
                  <Flag className="w-3 h-3" />
                  Report
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-[#2A2A2C] bg-[#161618]">
          <CardContent className="p-4 text-center">
            <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-xl font-bold text-white font-fira-code">{formatNumber(profile.reputation_points)}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Reputation</p>
          </CardContent>
        </Card>

        <Card className="border-[#2A2A2C] bg-[#161618]">
          <CardContent className="p-4 text-center">
            <FileText className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white font-fira-code">{formatNumber(profile.posts_count)}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Posts</p>
          </CardContent>
        </Card>

        <Card className="border-[#2A2A2C] bg-[#161618]">
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white font-fira-code">{formatNumber(profile.followers_count)}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Followers</p>
          </CardContent>
        </Card>

        <Card className="border-[#2A2A2C] bg-[#161618]">
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <p className="text-xl font-bold text-white font-fira-code">{formatNumber(profile.following_count)}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Following</p>
          </CardContent>
        </Card>
      </div>

      {/* Report modal */}
      {showReport && (
        <ReportUserModal
          open={showReport}
          onOpenChange={setShowReport}
          reportableId={profile.id}
          reportableType="user"
        />
      )}
    </div>
  );
}
