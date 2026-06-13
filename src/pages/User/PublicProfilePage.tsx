// src/pages/User/PublicProfilePage.tsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, TrendingUp, Flag } from 'lucide-react';
import { getUserProfile } from '../../features/User/F25_FollowUser/api';
import FollowButton from '../../features/User/F25_FollowUser/components/FollowButton';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import { timeAgo } from '../../lib/utils';
import { getRoleBadge, getReputationTier } from '../../features/User/F32_PublicProfile/types';
import ProfileStatsGrid from '../../features/User/F32_PublicProfile/components/ProfileStatsGrid';
import ReportUserModal from '../../features/User/F30_UserReport/components/ReportUserModal';

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
      <div className="max-w-4xl mx-auto py-6 md:py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8">
          <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3 w-full text-center sm:text-left">
            <Skeleton className="w-48 h-8 mx-auto sm:mx-0" />
            <Skeleton className="w-32 h-5 mx-auto sm:mx-0" />
            <Skeleton className="w-full sm:w-64 h-4 mx-auto sm:mx-0" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-gray-400 text-lg mb-2">User not found.</p>
        <p className="text-gray-600 text-sm">This profile may have been removed or doesn't exist.</p>
      </div>
    );
  }

  const roleBadge = getRoleBadge(profile.roles || []);
  const repTier = getReputationTier(profile.reputation_points);

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-8 px-4 md:px-6">
      {/* ── Profile Header ── */}
      <Card className="border-[#2A2A2C] bg-[#161618] mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            
            {/* Avatar */}
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-[#2A2A2C] shrink-0">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
              ) : null}
              <AvatarFallback className="bg-[#D4AF37] text-black text-xl sm:text-2xl font-bold">
                {profile.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 justify-center md:justify-start">
                <h1 className="text-xl sm:text-2xl font-bold text-white break-all max-w-full">
                  {profile.username}
                </h1>
                <div className="flex items-center gap-2 mt-1 sm:mt-0 flex-wrap justify-center">
                  <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${roleBadge.color}`}>
                    {roleBadge.label}
                  </Badge>
                  <span className={`text-xs font-semibold ${repTier.color}`}>
                    {repTier.label}
                  </span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-400 mt-2 mb-4 max-w-lg leading-relaxed break-words">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-gray-500">
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
            <div className="flex flex-row md:flex-col items-center md:items-end justify-center gap-3 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t border-[#2A2A2C]/40 md:border-t-0">
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
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1 md:p-0 rounded md:rounded-none"
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
      <ProfileStatsGrid profile={profile} />

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