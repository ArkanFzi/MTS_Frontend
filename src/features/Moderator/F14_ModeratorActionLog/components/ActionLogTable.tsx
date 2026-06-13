// src/features/Moderator/F14_ModeratorActionLog/components/ActionLogTable.tsx
import { ShieldAlert, EyeOff, Ban, CheckCircle2, Clock, AlertTriangle, UserX } from 'lucide-react';
import type { ModerationLog } from '../types';

interface ActionLogTableProps {
  logs: ModerationLog[] | undefined | null;
}

function getActionBadge(type: string) {
  // Pastikan type ada sebelum di-toUpperCase
  const actionType = (type || '').toUpperCase();
  
  switch (actionType) {
    case 'BAN_USER':
    case 'BAN':
      return { label: actionType, className: 'bg-red-950/40 text-red-400 border-red-800/60', icon: <Ban className="h-3 w-3" /> };
    case 'HIDE_POST':
    case 'HIDE':
      return { label: actionType, className: 'bg-amber-950/40 text-amber-400 border-amber-800/60', icon: <EyeOff className="h-3 w-3" /> };
    case 'APPROVE_REPORT':
    case 'RESOLVED':
      return { label: actionType, className: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60', icon: <CheckCircle2 className="h-3 w-3" /> };
    case 'WARN_USER':
    case 'WARN':
      return { label: actionType, className: 'bg-blue-950/40 text-blue-400 border-blue-800/60', icon: <AlertTriangle className="h-3 w-3" /> };
    case 'UNBAN':
      return { label: actionType, className: 'bg-green-950/40 text-green-400 border-green-800/60', icon: <UserX className="h-3 w-3" /> };
    default:
      return { label: actionType || 'UNKNOWN', className: 'bg-zinc-950/40 text-zinc-400 border-zinc-800/60', icon: <ShieldAlert className="h-3 w-3" /> };
  }
}

export default function ActionLogTable({ logs }: ActionLogTableProps) {
  // Pengecekan ketat: hanya map jika logs adalah array yang valid
  const isLogsArray = Array.isArray(logs);

  return (
    <div className="overflow-x-auto w-full font-['Inter']">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 bg-[#0B0B0C] text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <th className="py-3.5 px-6">Moderator</th>
            <th className="py-3.5 px-6">Tindakan</th>
            <th className="py-3.5 px-6">Target User</th>
            <th className="py-3.5 px-6">Alasan</th>
            <th className="py-3.5 px-6 text-right">Waktu</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 text-xs">
          {!isLogsArray || logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center font-mono text-zinc-600 uppercase tracking-wide">
                {!isLogsArray ? "Memuat data..." : "Belum ada log catatan aktivitas."}
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const badge = getActionBadge(log.action_type);
              return (
                <tr key={log.id} className="hover:bg-zinc-900/20 transition-colors">
                  <td className="py-4 px-6 font-medium text-zinc-200 font-mono">
                    @{log.moderator?.username || '—'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-mono font-bold tracking-tight rounded uppercase ${badge.className}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-zinc-300 font-mono text-[11px]">
                    @{log.target_user?.username || '—'}
                  </td>
                  <td className="py-4 px-6 text-zinc-400 max-w-xs truncate">
                    {log.reason || '—'}
                  </td>
                  <td className="py-4 px-6 text-right text-zinc-500 font-mono text-[11px]">
                    <div className="flex items-center justify-end gap-1.5">
                      <Clock className="h-3 w-3 text-zinc-600" />
                      {new Date(log.created_at).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}