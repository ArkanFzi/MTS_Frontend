// src/features/Admin/F9_UserManagement/components/UserRoleModal.tsx
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
import type { UserListItem } from '../types';

interface UserRoleModalProps {
  data: { user: UserListItem; newRole: string } | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function UserRoleModal({ data, onClose, onConfirm, isPending }: UserRoleModalProps) {
  return (
    <Dialog open={!!data} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-[#0B0B0C] border-[#2A2A2C]">
        <DialogHeader>
          <DialogTitle className="text-white">Confirm Role Change</DialogTitle>
          <DialogDescription className="text-gray-400">
            Change <span className="text-white font-medium">{data?.user.username}</span>'s role to{' '}
            <span className="text-[#D4AF37] font-medium uppercase">{data?.newRole}</span>?
          </DialogDescription>
        </DialogHeader>
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
            disabled={isPending}
            className="bg-[#D4AF37] text-black hover:bg-[#c29f2f]"
          >
            {isPending ? (
              <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Updating...</>
            ) : 'Confirm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}