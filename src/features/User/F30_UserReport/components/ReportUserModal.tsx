// src/features/User/F30_UserReport/components/ReportUserModal.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Flag, Loader2 } from 'lucide-react';
import { createReport } from '../api';
import type { CreateReportPayload } from '../types';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';

interface ReportUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportableId: string;
  reportableType: 'post' | 'comment' | 'user';
}

const REASON_OPTIONS = [
  'Spam',
  'Harassment',
  'Inappropriate Content',
  'Misinformation',
  'Offensive Language',
  'Other',
];

export default function ReportUserModal({
  open,
  onOpenChange,
  reportableId,
  reportableType,
}: ReportUserModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const mutation = useMutation({
    mutationFn: (data: CreateReportPayload) => createReport(data),
    onSuccess: () => {
      toast.success('Report submitted successfully. Our team will review it.');
      setReason('');
      setDescription('');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to submit report. Please try again.');
    },
  });

  const handleSubmit = () => {
    if (!reason.trim()) return;
    mutation.mutate({
      reportable_type: reportableType,
      reportable_id: reportableId,
      reason,
      description: description.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Flag className="w-5 h-5 text-red-400" />
            Report {reportableType.charAt(0).toUpperCase() + reportableType.slice(1)}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Help us understand the issue. Select a reason and optionally provide details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Reason selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">Reason *</label>
            <div className="grid grid-cols-2 gap-2">
              {REASON_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setReason(opt)}
                  className={`px-3 py-2 text-xs rounded-md border transition-all ${
                    reason === opt
                      ? 'border-red-500 bg-red-950/30 text-red-400 font-medium'
                      : 'border-[#2A2A2C] bg-[#0B0B0C] text-gray-400 hover:border-gray-600 hover:text-gray-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-300">
              Additional Details (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in more detail..."
              rows={3}
              maxLength={500}
              className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-none"
            />
            <p className="text-[10px] text-gray-600 text-right">
              {description.length}/500
            </p>
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
            disabled={!reason.trim() || mutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Flag className="w-3.5 h-3.5 mr-1.5" />
                Submit Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
