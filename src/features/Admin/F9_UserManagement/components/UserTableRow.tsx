// src/features/Admin/F9_UserManagement/components/UserTableRow.tsx
import { Shield, ShieldAlert, Ban, MoreHorizontal, KeyRound, AlertTriangle, ExternalLink, CheckCircle } from 'lucide-react';
import type { UserListItem } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu';

interface UserTableRowProps {
  user: UserListItem;
  currentUserRole?: string;
  onNavigate: (id: string) => void;
  onRoleChange: (user: UserListItem, role: string) => void;
  onResetPassword: (id: string, username: string) => void;
  onWarn: (id: string, username: string) => void;
  onBanModalOpen: (user: UserListItem) => void;
}

function getRoleBadge(roles: any) {
  // Menormalisasi array objek relasi atau string ke bentuk array string lowercase tunggal
  const normalizedRoles = Array.isArray(roles)
    ? roles.map((r: any) => (typeof r === 'string' ? r.toLowerCase() : r?.name?.toLowerCase()))
    : [];

  if (normalizedRoles.includes('admin')) return { label: 'Admin', color: 'bg-red-950/50 text-red-400 border-red-900' };
  if (normalizedRoles.includes('moderator')) return { label: 'Mod', color: 'bg-blue-950/50 text-blue-400 border-blue-900' };
  return { label: 'User', color: 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]' };
}

export default function UserTableRow({
  user,
  currentUserRole,
  onNavigate,
  onRoleChange,
  onResetPassword,
  onWarn,
  onBanModalOpen,
}: UserTableRowProps) {
  const roleBadge = getRoleBadge(user.roles);

  return (
    <tr className="hover:bg-[#1A1A1C] transition-colors">
      {/* User Info */}
      <td className="py-3 px-5">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            {user.avatar_url && <AvatarImage src={user.avatar_url} alt={user.username} />}
            <AvatarFallback className="bg-[#D4AF37] text-black text-[10px] font-bold">
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white text-sm">{user.username}</p>
            <p className="text-[10px] text-gray-600">Lv.{user.level}</p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="py-3 px-5 text-gray-400 font-mono text-[11px]">{user.email}</td>

      {/* Role */}
      <td className="py-3 px-5">
        <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${roleBadge.color}`}>
          {roleBadge.label}
        </Badge>
      </td>

      {/* Reputation */}
      <td className="py-3 px-5">
        <span className="text-[#D4AF37] font-mono font-bold">
          {user.reputation_points.toLocaleString()}
        </span>
      </td>

      {/* Status */}
      <td className="py-3 px-5">
        {user.is_banned ? (
          <Badge className="bg-red-950/50 text-red-400 border-red-900 text-[10px]">Banned</Badge>
        ) : (
          <Badge variant="outline" className="text-[10px] border-emerald-900 text-emerald-400 bg-emerald-950/30">Active</Badge>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 px-5 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-[#2A2A2C] text-gray-400 h-7 w-7 p-0 bg-transparent">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#0B0B0C] border-[#2A2A2C]">
            <DropdownMenuLabel className="text-[10px] text-gray-500">Change Role</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2A2A2C]" />
            <DropdownMenuItem onClick={() => onRoleChange(user, 'user')} className="text-xs text-gray-300">
              <Shield className="w-3.5 h-3.5 mr-2" /> Set as User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRoleChange(user, 'moderator')} className="text-xs text-gray-300">
              <ShieldAlert className="w-3.5 h-3.5 mr-2" /> Set as Moderator
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRoleChange(user, 'admin')} className="text-xs text-gray-300">
              <KeyRound className="w-3.5 h-3.5 mr-2" /> Set as Admin
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2A2A2C]" />
            <DropdownMenuItem
              onClick={() => onNavigate(user.id)}
              className="text-xs text-blue-400 focus:text-blue-300 focus:bg-blue-950/30"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-2" /> Manage Details
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2A2A2C]" />
            {currentUserRole === 'admin' && (
              <DropdownMenuItem onClick={() => onResetPassword(user.id, user.username)} className="text-xs text-gray-300">
                <KeyRound className="w-3.5 h-3.5 mr-2 text-blue-400" /> Reset Password
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onWarn(user.id, user.username)} className="text-xs text-gray-300">
              <AlertTriangle className="w-3.5 h-3.5 mr-2 text-amber-500" /> Warn User
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2A2A2C]" />
            <DropdownMenuItem 
              onClick={() => onBanModalOpen(user)}
              className={user.is_banned ? "text-xs text-emerald-400 focus:text-emerald-300 focus:bg-emerald-950/20" : "text-xs text-red-400 focus:text-red-300 focus:bg-red-950/20"}
            >
              {user.is_banned ? (
                <><CheckCircle className="w-3.5 h-3.5 mr-2" /> Unban User</>
              ) : (
                <><Ban className="w-3.5 h-3.5 mr-2" /> Ban User</>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}