// src/features/Moderator/F14_ModeratorActionLog/components/ActionLogTable.tsx
import React from 'react';
import { ShieldAlert, EyeOff, Ban, CheckCircle2, Clock } from 'lucide-react';

// Struktur data lokal untuk keperluan UI
interface LogItem {
  id: string;
  moderatorName: string;
  actionType: 'HIDE_POST' | 'BAN_USER' | 'APPROVE_REPORT' | 'WARN_USER';
  target: string;
  reason: string;
  timestamp: string;
}

interface ActionLogTableProps {
  logs: LogItem[];
}

export default function ActionLogTable({ logs }: ActionLogTableProps) {
  
  // Helper badge warna dan ikon untuk tipe aksi brutalisme
  const getActionBadge = (type: LogItem['actionType']) => {
    switch (type) {
      case 'BAN_USER':
        return {
          label: 'BAN USER',
          className: 'bg-red-950/40 text-red-400 border-red-800/60',
          icon: <Ban className="h-3 w-3" />
        };
      case 'HIDE_POST':
        return {
          label: 'HIDE POST',
          className: 'bg-amber-950/40 text-amber-400 border-amber-800/60',
          icon: <EyeOff className="h-3 w-3" />
        };
      case 'APPROVE_REPORT':
        return {
          label: 'APPROVE',
          className: 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60',
          icon: <CheckCircle2 className="h-3 w-3" />
        };
      default:
        return {
          label: 'WARN USER',
          className: 'bg-blue-950/40 text-blue-400 border-blue-800/60',
          icon: <ShieldAlert className="h-3 w-3" />
        };
    }
  };

  return (
    <div className="overflow-x-auto w-full font-['Inter']">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 bg-[#0B0B0C] text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <th className="py-3.5 px-6">Moderator</th>
            <th className="py-3.5 px-6">Tindakan</th>
            <th className="py-3.5 px-6">Target Objek</th>
            <th className="py-3.5 px-6">Alasan Ringkas</th>
            <th className="py-3.5 px-6 text-right">Waktu Kejadian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 text-xs">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-12 text-center font-mono text-zinc-600 uppercase tracking-wide">
                Belum ada log catatan aktivitas.
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const badge = getActionBadge(log.actionType);
              return (
                <tr key={log.id} className="hover:bg-zinc-900/20 transition-colors">
                  {/* DATA MODERATOR */}
                  <td className="py-4 px-6 font-medium text-zinc-200 font-mono">
                    @{log.moderatorName}
                  </td>
                  
                  {/* TYPE BADGE */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-mono font-bold tracking-tight rounded uppercase ${badge.className}`}>
                      {badge.icon}
                      {badge.label}
                    </span>
                  </td>
                  
                  {/* TARGET */}
                  <td className="py-4 px-6 text-zinc-300 font-mono text-[11px]">
                    {log.target}
                  </td>
                  
                  {/* REASON */}
                  <td className="py-4 px-6 text-zinc-400 max-w-xs truncate">
                    {log.reason}
                  </td>
                  
                  {/* TIMESTAMP */}
                  <td className="py-4 px-6 text-right text-zinc-500 font-mono text-[11px]">
                    <div className="flex items-center justify-end gap-1.5">
                      <Clock className="h-3 w-3 text-zinc-600" />
                      {log.timestamp}
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