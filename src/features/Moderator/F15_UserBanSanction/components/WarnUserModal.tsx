import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { warnUser } from '../api';
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

interface WarnUserModalProps {
  userId: string;
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MODERATION_REASONS = [
  'Konten melanggar aturan komunitas',
  'Spam atau aktivitas berbahaya',
  'Pelecehan atau ujaran kebencian',
  'Informasi palsu',
];

export default function WarnUserModal({ userId, username, open, onOpenChange }: WarnUserModalProps) {
  const [reason, setReason] = useState(MODERATION_REASONS[0]);
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => warnUser(userId, { reason, notes: notes || undefined }),
    onSuccess: () => {
      toast.success('Warning successfully sent to user.');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setNotes('');
      setReason(MODERATION_REASONS[0]);
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send warning.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#161618] border-[#2A2A2C]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Warn User
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            Send a formal warning to <span className="text-white font-medium">{username}</span>.
            This will deduct 5 reputation points from the user.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#D4AF37] transition-colors"
            >
              {MODERATION_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Context or internal notes..."
              rows={3}
              className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-none"
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
              disabled={mutation.isPending}
              className="bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Sending...</>
              ) : 'Send Warning'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
