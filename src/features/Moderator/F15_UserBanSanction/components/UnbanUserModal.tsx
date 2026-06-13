// src/features/Moderator/F15_UserBanSanction/components/UnbanUserModal.tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck } from 'lucide-react';
import { unbanUser } from '../api';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner';
import type { User } from '../../../../types';

interface UnbanUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UnbanUserModal({ user, isOpen, onClose }: UnbanUserModalProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => unbanUser(user!.id),
    onSuccess: () => {
      toast.success('User has been unbanned.');
      queryClient.invalidateQueries({ queryKey: ['admin-bans'] });
      onClose();
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to unban user.');
    }
  });

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#161618] border border-[#2A2A2C] rounded-xl p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-950/30 border border-emerald-900/40 flex items-center justify-center mx-auto mb-4">
          <UserCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Unban User</h3>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to restore access for <span className="text-white font-semibold">{user.username}</span>?
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose} className="border-[#2A2A2C] text-gray-400 hover:text-white">
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50"
          >
            {mutation.isPending ? 'Unbanning...' : 'Confirm Unban'}
          </Button>
        </div>
      </div>
    </div>
  );
}
