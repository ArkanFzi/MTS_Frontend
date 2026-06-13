// src/features/Admin/F9_UserManagement/components/UserBanModal.tsx
import { Loader2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog';

interface UserBanModalProps {
  data: { id: string; username: string; isBanned: boolean } | null;
  reason: string;
  setReason: (val: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function UserBanModal({
  data,
  reason,
  setReason,
  onClose,
  onConfirm,
  isPending,
}: UserBanModalProps) {
  return (
    <Dialog open={!!data} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-[#0B0B0C] border-[#2A2A2C]">
        <DialogHeader>
          <DialogTitle className="text-white">
            {data?.isBanned ? 'Confirm Unban User' : 'Confirm Ban User'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {data?.isBanned ? (
              <>Are you sure you want to restore access for <span className="text-white font-medium">{data?.username}</span>? They will be able to log back into the platform.</>
            ) : (
              <>Are you sure you want to ban <span className="text-white font-medium">{data?.username}</span>? This will immediately revoke their access to the application.</>
            )}
          </DialogDescription>
        </DialogHeader>

        {!data?.isBanned && data && (
          <div className="my-2 space-y-2">
            <label className="text-[11px] font-mono uppercase text-gray-500 tracking-wider">
              Reason for Ban <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Spamming, violating community standards..."
              rows={3}
              className="w-full bg-[#1A1A1C] border border-[#2A2A2C] rounded-md px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] resize-none transition-colors"
            />
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#2A2A2C] text-gray-400 bg-transparent hover:bg-[#1A1A1C]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending || (!data?.isBanned && !reason.trim())}
            className={data?.isBanned 
              ? "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" 
              : "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            }
          >
            {isPending ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Processing...</>
            ) : data?.isBanned ? 'Confirm Unban' : 'Confirm Ban'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}