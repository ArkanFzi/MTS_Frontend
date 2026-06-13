// src/features/Admin/F9_UserManagement/components/UserProfileCard.tsx
import { User, Star, Shield, Calendar, Ban } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import type { UserDetail } from '../types';

function getRoleBadge(roles: string[]) {
  if (roles.includes('admin')) return { label: 'Admin', color: 'bg-red-950/50 text-red-400 border-red-900' };
  if (roles.includes('moderator')) return { label: 'Moderator', color: 'bg-blue-950/50 text-blue-400 border-blue-900' };
  return { label: 'User', color: 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]' };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface UserProfileCardProps {
  user: UserDetail;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const roleBadge = getRoleBadge(user.roles);

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-[#2A2A2C]">
                {user.avatar_url ? (
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                ) : null}
                <AvatarFallback className="bg-[#D4AF37] text-black text-xl font-bold">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#161618] ${
                  user.is_banned ? 'bg-red-500' : 'bg-emerald-500'
                }`}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{user.username}</h2>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 ${roleBadge.color}`}>
                {roleBadge.label}
              </Badge>
              {user.is_banned ? (
                <Badge className="text-[10px] bg-red-950/50 text-red-400 border border-red-900">Banned</Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-emerald-900 text-emerald-400 bg-emerald-950/30">Active</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Star className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Reputation</p>
              <p className="text-white font-bold font-mono">{user.reputation_points.toLocaleString()} pts</p>
            </div>
          </div>
          <div className="border-t border-[#2A2A2C]" />
          <div className="flex items-center gap-3 text-sm">
            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Level</p>
              <p className="text-white font-bold font-mono">Lv. {user.level}</p>
            </div>
          </div>
          <div className="border-t border-[#2A2A2C]" />
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Bergabung</p>
              <p className="text-white text-xs">{formatDate(user.created_at)}</p>
            </div>
          </div>
          {user.is_banned && (
            <>
              <div className="border-t border-[#2A2A2C]" />
              <div className="flex items-center gap-3 text-sm">
                <Ban className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-red-500 uppercase tracking-wider font-bold">User Banned</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bio Card */}
      {user.bio && (
        <Card className="border-[#2A2A2C] bg-[#161618]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Bio
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-400 leading-relaxed">{user.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
