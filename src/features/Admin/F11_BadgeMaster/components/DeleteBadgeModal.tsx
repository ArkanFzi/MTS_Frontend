// src/features/Admin/F11_BadgeMaster/components/DeleteBadgeModal.tsx
import { Trash2 } from 'lucide-react';
import type { Badge } from '../types';

interface DeleteBadgeModalProps {
  badge: Badge | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteBadgeModal({ badge, onClose, onConfirm, isDeleting }: DeleteBadgeModalProps) {
  if (!badge) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#161618] border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/40">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Delete Badge</h3>
            <p className="text-xs text-zinc-500">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Are you sure you want to delete <span className="text-white font-semibold">"{badge.name}"</span>?
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Badge'}
          </button>
        </div>
      </div>
    </div>
  );
}
