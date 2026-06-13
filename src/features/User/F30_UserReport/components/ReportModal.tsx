import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, Flag } from 'lucide-react';
import { submitReport } from '../api';
import type { ReportPayload } from '../types';
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

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
  targetType: 'post' | 'comment';
}

const REPORT_REASONS = [
  'Spam atau iklan promosi',
  'Kata-kata kasar atau pelecehan',
  'Informasi palsu / hoaks',
  'Mengandung unsur SARA / Kebencian',
  'Lainnya',
];

export default function ReportModal({ open, onOpenChange, targetId, targetType }: ReportModalProps) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');

  const mutation = useMutation({
    mutationFn: (data: ReportPayload) => submitReport(data),
    onSuccess: () => {
      toast.success('Laporan berhasil dikirim. Terima kasih atas partisipasimu.');
      onOpenChange(false);
      setReason(REPORT_REASONS[0]);
      setDescription('');
    },
    onError: (error: unknown) => {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Gagal mengirim laporan. Silakan coba lagi.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      target_id: targetId,
      target_type: targetType,
      reason,
      description,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#161618] border-[#2A2A2C]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Flag className="w-5 h-5 text-red-400" />
              Laporkan Konten
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm">
              Bantu kami menjaga komunitas tetap aman. Mengapa kamu melaporkan konten ini?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Alasan Utama</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#D4AF37] transition-colors"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Detail Tambahan (Opsional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berikan penjelasan lebih detail jika diperlukan..."
                rows={3}
                className="w-full rounded-md border border-[#2A2A2C] bg-[#0B0B0C] px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[#2A2A2C] text-gray-400 hover:bg-[#2A2A2C] bg-transparent"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-red-900/80 text-red-100 hover:bg-red-800 border border-red-800 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Laporan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
