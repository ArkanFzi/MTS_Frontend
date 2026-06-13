// src/features/Moderator/F15_UserBanSanction/components/UserSanctionRow.tsx
import { UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import type { User } from '../../../../types';

interface UserSanctionRowProps {
  user: User;
  onWarn: (user: User) => void;
  onBan: (user: User) => void;
  onUnban: (user: User) => void;
}

export default function UserSanctionRow({ user, onWarn, onBan, onUnban }: UserSanctionRowProps) {
  return (
    <tr className="hover:bg-[#2A2A2C]/30 transition-colors">
      <td className="py-3 px-6 text-gray-200 font-medium">{user.username}</td>
      <td className="py-3 px-6 text-gray-400">{user.email}</td>
      <td className="py-3 px-6 text-center">
        {user.is_banned ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/40 text-red-400 border border-red-900/50 text-[10px] font-bold tracking-wider uppercase">
            <UserX className="w-3 h-3" /> Banned
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 text-[10px] font-bold tracking-wider uppercase">
            <UserCheck className="w-3 h-3" /> Active
          </span>
        )}
      </td>
      <td className="py-3 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {!user.is_banned && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onWarn(user)}
                className="h-8 border-[#2A2A2C] text-amber-500 hover:bg-amber-950/30 hover:text-amber-400 hover:border-amber-900/50 gap-1"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Warn
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBan(user)}
                className="h-8 border-[#2A2A2C] text-red-500 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 gap-1"
              >
                <UserX className="w-3.5 h-3.5" /> Ban
              </Button>
            </>
          )}
          {user.is_banned && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUnban(user)}
              className="h-8 border-[#2A2A2C] text-emerald-500 hover:bg-emerald-950/30 hover:text-emerald-400 hover:border-emerald-900/50 gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" /> Unban
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
