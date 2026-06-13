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
  onSubmit: (payload: { action?: 'warn' | 'ban' | 'none'; reason?: string; notes?: string }) => void;
  isLoading?: boolean;
}

const MODERATION_REASONS = [
  'Konten melanggar aturan komunitas',
  'Spam atau aktivitas berbahaya',
  'Pelecehan atau ujaran kebencian',
  'Informasi palsu',
];

export default function ActionReasonModal({
  open,
  onOpenChange,
  action,
  onSubmit,
  isLoading = false,
}: ActionReasonModalProps) {
  const [modAction, setModAction] = useState<'warn' | 'ban' | 'none'>('warn');
  const [reason, setReason] = useState(MODERATION_REASONS[0]);
  const [notes, setNotes] = useState('');

  const isResolve = action === 'resolved';

  const handleSubmit = () => {
    if (isResolve) {
      onSubmit({
        action: modAction,
        reason,
        notes: notes.trim() || undefined,
      });
    } else {
      onSubmit({
        notes: notes.trim() || undefined,
      });
    }
    setNotes('');
    setModAction('warn');
    setReason(MODERATION_REASONS[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#161618] border-[#2A2A2C]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <ShieldCheck className={`w-5 h-5 ${isResolve ? 'text-emerald-400' : 'text-zinc-400'}`} />
            {isResolve ? 'Resolve Report' : 'Dismiss Report'}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm">
            {isResolve
              ? 'Mark this report as resolved and take action against the content/user.'
              : 'Dismiss this report. The reported content will remain unchanged.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {isResolve && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300">Action to Take</label>
                <select
                  value={modAction}
                  onChange={(e) => setModAction(e.target.value as 'warn' | 'ban' | 'none')}
                  className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#D4AF37] transition-colors"
                >
                  <option value="warn">Warn User (Deduct 10 Points)</option>
                  <option value="ban">Ban User (Block Access)</option>
                  <option value="none">No Action (Just resolve)</option>
                </select>
              </div>

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
            </>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">
              Additional Notes {isResolve && '(Optional)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isResolve ? 'Internal notes for moderators...' : 'Reason for dismissal...'}
              rows={3}
              className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-none"
            />
          </div>
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
            disabled={isLoading || (!isResolve && !notes.trim())}
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
