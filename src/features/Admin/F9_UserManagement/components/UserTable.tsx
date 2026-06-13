// src/features/Admin/F9_UserManagement/components/UserTable.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { UserListItem } from '../types';
import { updateUserRole, toggleUserBan } from '../api'; 
import { useAuthStore } from '../../../../store/useAuthStore';

// Modals terpisah
import UserRoleModal from './UserRoleModal';
import UserBanModal from './UserBanModal';
import UserTableRow from './UserTableRow';
import ResetPasswordModal from './ResetPasswordModal';
import WarnUserModal from '../../../Moderator/F15_UserBanSanction/components/WarnUserModal';

import { toast } from 'sonner';

interface UserTableProps {
  users: UserListItem[];
}

type RoleFilter = 'all' | 'admin' | 'moderator' | 'user';

export default function UserTable({ users }: UserTableProps) {
  const { user: currentUser } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State Manajemen Filter
  const [activeFilter, setActiveFilter] = useState<RoleFilter>('all');

  // State Manajemen Modal
  const [roleModal, setRoleModal] = useState<{ user: UserListItem; newRole: string } | null>(null);
  const [banModal, setBanModal] = useState<{ id: string; username: string; isBanned: boolean } | null>(null);
  const [warnModalOpen, setWarnModalOpen] = useState<{ id: string; username: string } | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState<{ id: string; username: string } | null>(null);
  const [banReason, setBanReason] = useState<string>('');

  const safeUsers = Array.isArray(users) ? users : [];

  // Logic Penyaringan Data (Defensif terhadap format string & object relation Laravel)
  const filteredUsers = safeUsers.filter((user) => {
    if (activeFilter === 'all') return true;

    const userRoles = Array.isArray(user.roles)
      ? user.roles.map((r: any) => (typeof r === 'string' ? r.toLowerCase() : r?.name?.toLowerCase()))
      : [];

    if (activeFilter === 'user') {
      // Mengasumsikan user biasa adalah yang tidak punya role admin maupun moderator
      return !userRoles.includes('admin') && !userRoles.includes('moderator');
    }
    return userRoles.includes(activeFilter);
  });

  // Mutations
  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRole(id, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully.');
      setRoleModal(null);
    },
    onError: () => toast.error('Failed to update user role.'),
  });

  const banMutation = useMutation({
    mutationFn: ({ id, isBanned, reason }: { id: string; isBanned: boolean; reason: string }) => 
      toggleUserBan(id, isBanned, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User account status updated successfully.');
      setBanModal(null);
      setBanReason('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status.');
    },
  });

  // Handlers
  const confirmRoleChange = () => {
    if (!roleModal) return;
    roleMutation.mutate({ id: roleModal.user.id, role: roleModal.newRole });
  };

  const confirmBanToggle = () => {
    if (!banModal) return;
    if (!banModal.isBanned && !banReason.trim()) {
      toast.error('Please provide a reason for the ban.');
      return;
    }
    banMutation.mutate({ 
      id: banModal.id, 
      isBanned: banModal.isBanned, 
      reason: banModal.isBanned ? 'Account restored' : banReason.trim() 
    });
  };

  return (
    <>
      {/* FILTER TABS UTAMA */}
      <div className="flex items-center p-1 bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg max-w-md mb-6 font-mono text-[11px] tracking-wider uppercase">
        {(['all', 'admin', 'moderator', 'user'] as RoleFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`flex-1 py-1.5 rounded-md text-center font-medium transition-all duration-200 ${
              activeFilter === filter
                ? 'bg-[#1A1A1C] text-[#D4AF37] shadow-sm font-bold border border-[#2A2A2C]/60'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {filter === 'user' ? 'Members' : filter}
          </button>
        ))}
      </div>

      {/* TABEL DATA PENGGUNA */}
      <div className="overflow-x-auto border border-[#2A2A2C] rounded-lg bg-[#0B0B0C]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#2A2A2C] bg-[#070708] text-[11px] font-mono text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Reputation</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2C] text-xs">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-600 font-mono uppercase tracking-wide">
                  No {activeFilter !== 'all' ? activeFilter : ''} users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  currentUserRole={currentUser?.role}
                  onNavigate={(id) => navigate(`/admin/users/${id}`)}
                  onRoleChange={(usr, role) => setRoleModal({ user: usr, newRole: role })}
                  onResetPassword={(id, username) => setResetModalOpen({ id, username })}
                  onWarn={(id, username) => setWarnModalOpen({ id, username })}
                  onBanModalOpen={(usr) => setBanModal({ id: usr.id, username: usr.username, isBanned: usr.is_banned })}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SUB-KOMPONEN DIALOG & MODALS MODULAR */}
      <UserRoleModal
        data={roleModal}
        onClose={() => setRoleModal(null)}
        onConfirm={confirmRoleChange}
        isPending={roleMutation.isPending}
      />

      <UserBanModal
        data={banModal}
        reason={banReason}
        setReason={setBanReason}
        onClose={() => { setBanModal(null); setBanReason(''); }}
        onConfirm={confirmBanToggle}
        isPending={banMutation.isPending}
      />

      {warnModalOpen && (
        <WarnUserModal
          userId={warnModalOpen.id}
          username={warnModalOpen.username}
          open={!!warnModalOpen}
          onOpenChange={(open) => !open && setWarnModalOpen(null)}
        />
      )}

      {resetModalOpen && (
        <ResetPasswordModal
          userId={resetModalOpen.id}
          username={resetModalOpen.username}
          open={!!resetModalOpen}
          onOpenChange={(open) => !open && setResetModalOpen(null)}
        />
      )}
    </>
  );
}