// src/features/User/F19_PostEditHistory/components/PostHistoryDiff.tsx
import { Clock, User, FileDiff } from 'lucide-react';
import type { PostEditHistory } from '../types';

interface PostHistoryDiffProps {
  history: PostEditHistory[];
}

export default function PostHistoryDiff({ history }: PostHistoryDiffProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-[#2A2A2C] rounded-xl">
        <FileDiff className="w-10 h-10 text-gray-700 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Belum ada riwayat edit untuk postingan ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry, index) => (
        <div
          key={entry.id}
          className="border border-[#2A2A2C] bg-[#161618] rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0B0B0C] border-b border-[#2A2A2C]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {new Date(entry.edited_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-xs text-gray-600">•</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <User className="w-3 h-3" />
                {entry.editor?.username || 'Unknown'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-600">
              Rev {history.length - index}
            </span>
          </div>

          {/* Reason (if available) */}
          {entry.reason && (
            <div className="px-4 py-2 border-b border-[#2A2A2C] bg-amber-950/10">
              <p className="text-xs text-amber-400/80">
                <span className="font-semibold">Reason:</span> {entry.reason}
              </p>
            </div>
          )}

          {/* Diff Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#2A2A2C]">
            {/* Before */}
            <div className="p-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400/70 mb-2">
                Before
              </p>
              <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed font-mono bg-[#0B0B0C] border border-[#2A2A2C] rounded p-3 max-h-48 overflow-y-auto">
                {entry.body_before}
              </pre>
            </div>

            {/* After */}
            <div className="p-4">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400/70 mb-2">
                After
              </p>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-mono bg-[#0B0B0C] border border-[#2A2A2C] rounded p-3 max-h-48 overflow-y-auto">
                {entry.body_after}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
