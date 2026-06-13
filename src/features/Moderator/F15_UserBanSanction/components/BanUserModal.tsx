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
      {/* Overlay Gelap saja tanpa blur */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      
      {/* Modal diperkecil dengan max-w-sm */}
      <div className="relative z-10 w-full max-w-sm bg-[#161618] border border-[#2A2A2C] rounded-xl p-5 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/40">
            <UserX className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Ban User</h3>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              {user.username}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-500 mb-2">BAN REASON</label>
          <textarea
            className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-lg p-3 text-xs text-gray-200 outline-none focus:border-red-500/50 min-h-[80px]"
            placeholder="Provide a reason for the ban..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="text-xs text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={!reason.trim() || mutation.isPending}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-full px-4 h-9"
          >
            {mutation.isPending ? 'Banning...' : 'Confirm Ban'}
          </Button>
        </div>
      </div>
    </div>
  );
}