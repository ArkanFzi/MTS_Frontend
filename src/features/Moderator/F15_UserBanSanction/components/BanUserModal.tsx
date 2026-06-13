// src/features/Moderator/F15_UserBanSanction/components/BanUserModal.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserX } from 'lucide-react';
import { banUser } from '../api';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner';
import type { User } from '../../../../types';

interface BanUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BanUserModal({ user, isOpen, onClose }: BanUserModalProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState('');

  const mutation = useMutation({
    mutationFn: () => banUser(user!.id, { reason }),
    onSuccess: () => {
      toast.success('User has been banned.');
      queryClient.invalidateQueries({ queryKey: ['admin-bans'] });
      onClose();
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to ban user.');
    }
  });

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#161618] border border-[#2A2A2C] rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/40">
            <UserX className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Ban User</h3>
            <p className="text-xs text-gray-400">Suspend account access for {user.username}</p>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">Ban Reason</label>
          <textarea
            className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg p-3 text-sm text-gray-200 outline-none focus:border-red-500 min-h-[100px]"
            placeholder="Provide a reason for the ban..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-[#2A2A2C] text-gray-400 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!reason.trim() || mutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
          >
            {mutation.isPending ? 'Banning...' : 'Confirm Ban'}
          </Button>
        </div>
      </div>
    </div>
  );
}
