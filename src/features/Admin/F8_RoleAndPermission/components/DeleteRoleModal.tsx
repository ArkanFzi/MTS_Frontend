// src/features/Admin/F8_RoleAndPermission/components/DeleteRoleModal.tsx
import { Trash2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import type { Role } from '../types';

interface DeleteRoleModalProps {
  role: Role | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteRoleModal({
  role,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteRoleModalProps) {
  if (!role) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#161618] border border-[#2A2A2C] rounded-xl p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-950/30 border border-red-900/40 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Delete Role</h3>
        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to delete role{' '}
          <span className="text-white font-semibold">{role.name}</span>?
        </p>
        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#2A2A2C] text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
