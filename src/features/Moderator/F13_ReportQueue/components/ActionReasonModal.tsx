// src/features/Moderator/F13_ReportQueue/components/ActionReasonModal.tsx
import { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';

interface ActionReasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'resolved' | 'dismissed';
  onSubmit: (note: string) => void;
  isLoading?: boolean;
}

export default function ActionReasonModal({
  open,
  onOpenChange,
  action,
  onSubmit,
  isLoading = false,
}: ActionReasonModalProps) {
  const [note, setNote] = useState('');

  const isResolve = action === 'resolved';

  const handleSubmit = () => {
    onSubmit(note.trim());
    setNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <ShieldCheck className={`w-5 h-5 ${isResolve ? 'text-emerald-400' : 'text-zinc-400'}`} />
            {isResolve ? 'Resolve Report' : 'Dismiss Report'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isResolve
              ? 'Mark this report as resolved. Add a note describing the action taken.'
              : 'Dismiss this report. The reported content will remain unchanged.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <label className="text-xs font-medium text-gray-300">
            Resolution Note {isResolve && '*'}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={isResolve ? 'Describe the action taken...' : 'Reason for dismissal (optional)...'}
            rows={3}
            className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-none"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#2A2A2C] text-gray-400 hover:bg-[#0B0B0C] bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || (isResolve && !note.trim())}
            className={
              isResolve
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'
                : 'bg-zinc-700 text-white hover:bg-zinc-600 disabled:opacity-50'
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                {isResolve ? 'Resolve' : 'Dismiss'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
