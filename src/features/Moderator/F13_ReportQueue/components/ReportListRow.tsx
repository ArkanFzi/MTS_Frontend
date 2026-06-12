// src/features/Moderator/F13_ReportQueue/components/ReportListRow.tsx
import { ShieldAlert, Clock, User, FileText, MessageSquare, Eye } from 'lucide-react';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
import type { Report } from '../types';

interface ReportListRowProps {
  report: Report;
  onView: (report: Report) => void;
  onAction: (report: Report, action: 'resolved' | 'dismissed') => void;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-amber-950/40 text-amber-400 border-amber-800/60' },
  reviewed: { label: 'Reviewed', className: 'bg-blue-950/40 text-blue-400 border-blue-800/60' },
  resolved: { label: 'Resolved', className: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60' },
  dismissed: { label: 'Dismissed', className: 'bg-zinc-800/40 text-zinc-400 border-zinc-700/60' },
};

const targetTypeIcon: Record<string, React.ReactNode> = {
  post: <FileText className="w-3.5 h-3.5" />,
  comment: <MessageSquare className="w-3.5 h-3.5" />,
  user: <User className="w-3.5 h-3.5" />,
};

export default function ReportListRow({ report, onView, onAction }: ReportListRowProps) {
  const status = statusConfig[report.status] || statusConfig.pending;

  return (
    <div className="flex items-start gap-4 p-4 border-b border-[#2A2A2C] hover:bg-[#1A1A1C] transition-colors">
      {/* Target type icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#0B0B0C] border border-[#2A2A2C] flex items-center justify-center text-gray-400">
        {targetTypeIcon[report.target_type] || <ShieldAlert className="w-3.5 h-3.5" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 ${status.className}`}>
            {status.label}
          </Badge>
          <span className="text-[10px] text-gray-600 uppercase font-mono">
            {report.target_type}
          </span>
        </div>

        <p className="text-sm text-gray-200 font-medium mb-1">
          {report.reason}
        </p>

        {report.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">
            {report.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-[10px] text-gray-600">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            Reporter: {report.reporter?.username || 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(report.created_at)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(report)}
          className="border-[#2A2A2C] text-gray-400 hover:bg-[#0B0B0C] h-8 px-3 text-xs bg-transparent"
        >
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>

        {report.status === 'pending' && (
          <>
            <Button
              size="sm"
              onClick={() => onAction(report, 'resolved')}
              className="bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-950/80 h-8 px-3 text-xs"
            >
              Resolve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAction(report, 'dismissed')}
              className="border-zinc-700 text-zinc-400 hover:bg-zinc-800/50 h-8 px-3 text-xs bg-transparent"
            >
              Dismiss
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
