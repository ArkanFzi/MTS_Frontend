// src/features/Admin/F9_UserManagement/components/UserTable.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, ShieldAlert, Ban, MoreHorizontal, Loader2, KeyRound } from 'lucide-react';
import type { UserListItem } from '../types';
import { updateUserRole } from '../api';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { toast } from 'sonner';

interface UserTableProps {
  users: UserListItem[];
}

function getRoleBadge(roles: string[]) {
  if (roles.includes('admin')) return { label: 'Admin', color: 'bg-red-950/50 text-red-400 border-red-900' };
  if (roles.includes('moderator')) return { label: 'Mod', color: 'bg-blue-950/50 text-blue-400 border-blue-900' };
  return { label: 'User', color: 'bg-[#1A1A1C] text-gray-400 border-[#2A2A2C]' };
}

export default function UserTable({ users }: UserTableProps) {
  const queryClient = useQueryClient();
  const [roleModal, setRoleModal] = useState<{ user: UserListItem; newRole: string } | null>(null);

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully.');
      setRoleModal(null);
    },
    onError: () => {
      toast.error('Failed to update user role.');
    },
  });

  const handleRoleChange = (user: UserListItem, newRole: string) => {
    setRoleModal({ user, newRole });
  };

  const confirmRoleChange = () => {
    if (!roleModal) return;
    roleMutation.mutate({ id: roleModal.user.id, role: roleModal.newRole });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2A2A2C] bg-[#0B0B0C] text-[11px] font-mono text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Reputation</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2C] text-xs">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-600 font-mono uppercase tracking-wide">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const roleBadge = getRoleBadge(user.roles);
                return (
                  <tr key={user.id} className="hover:bg-[#1A1A1C] transition-colors">
                    {/* User */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          {user.avatar_url ? (
                            <AvatarImage src={user.avatar_url} alt={user.username} />
                          ) : null}
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
                      <span className="text-[#D4AF37] font-fira-code font-bold">
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
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="text-[10px] text-gray-500">Change Role</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleRoleChange(user, 'user')}>
                            <Shield className="w-3.5 h-3.5 mr-2" />
                            Set as User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user, 'moderator')}>
                            <ShieldAlert className="w-3.5 h-3.5 mr-2" />
                            Set as Moderator
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user, 'admin')}>
                            <KeyRound className="w-3.5 h-3.5 mr-2" />
                            Set as Admin
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-400">
                            <Ban className="w-3.5 h-3.5 mr-2" />
                            Ban User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Role change confirmation modal */}
      <Dialog open={!!roleModal} onOpenChange={() => setRoleModal(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Confirm Role Change</DialogTitle>
            <DialogDescription className="text-gray-400">
              Change <span className="text-white font-medium">{roleModal?.user.username}</span>'s role to{' '}
              <span className="text-[#D4AF37] font-medium">{roleModal?.newRole}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleModal(null)}
              className="border-[#2A2A2C] text-gray-400 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              disabled={roleMutation.isPending}
              className="bg-[#D4AF37] text-black hover:bg-[#c29f2f]"
            >
              {roleMutation.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Updating...</>
              ) : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
