import { Award, FileText, Users } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import { formatNumber } from '../../../../lib/utils';
import type { UserProfileData } from '../../F25_FollowUser/types';

interface ProfileStatsGridProps {
  profile: UserProfileData;
}

export default function ProfileStatsGrid({ profile }: ProfileStatsGridProps) {
  return (
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
  );
}
