import { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { resetUserPassword } from '../api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { toast } from 'sonner';

interface ResetPasswordModalProps {
  userId: string;
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ResetPasswordModal({ userId, username, open, onOpenChange }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const mutation = useMutation({
    mutationFn: () => resetUserPassword(userId, { password, password_confirmation: passwordConfirmation }),
    onSuccess: () => {
      toast.success('Password successfully reset.');
      setPassword('');
      setPasswordConfirmation('');
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reset password.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match.');
      return;
    }
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#161618] border-[#2A2A2C]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <KeyRound className="w-5 h-5 text-blue-400" />
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Set a new password for <span className="text-white font-medium">{username}</span>.
            The user will not be notified automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Re-type new password"
              className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#2A2A2C] text-gray-400 hover:bg-[#0B0B0C] bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending || !password || !passwordConfirmation}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Resetting...</>
              ) : 'Reset Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
