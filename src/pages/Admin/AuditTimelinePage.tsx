// src/pages/Admin/AuditTimelinePage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollText, Clock, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAuditLogs } from '../../features/Admin/F9_UserManagement/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';
import type { AuditLogEntry } from '../../features/Admin/F9_UserManagement/types';
import { getActionColor, formatTimestamp } from '../../features/Admin/F9_UserManagement/types';

export default function AuditTimelinePage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: () => getAuditLogs(page),
  });

  const logs: AuditLogEntry[] = data?.data || [];
  const meta = data?.meta;

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
              <ScrollText className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Audit Timeline</h1>
              <p className="text-sm text-gray-500">
                Complete log of all moderation actions performed on the platform.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden shadow-none">
          <CardHeader className="pb-4 border-b border-[#2A2A2C] bg-[#111112]/50">
            <CardTitle className="text-sm font-bold text-gray-300 uppercase tracking-widest">
              Timeline
            </CardTitle>
            {meta && (
              <CardDescription className="text-xs font-mono text-gray-600">
                Page {meta.current_page} of {meta.last_page} • {meta.total} total entries
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-0">
            {isLoading && (
              <div className="flex items-center justify-center p-12">
                <LoadingSpinner text="Loading audit logs..." />
              </div>
            )}

            {isError && (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm">Failed to load audit logs.</p>
              </div>
            )}

            {!isLoading && !isError && logs.length === 0 && (
              <div className="text-center py-16">
                <ScrollText className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No audit log entries yet.</p>
              </div>
            )}

            {!isLoading && !isError && logs.length > 0 && (
              <div className="divide-y divide-[#2A2A2C]">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex gap-4 px-4 sm:px-6 py-4 hover:bg-[#2A2A2C]/20 transition-colors"
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center pt-1 flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full border-2 ${getActionColor(log.action_type)}`} />
                      <div className="flex-1 w-px bg-[#2A2A2C] mt-2" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 self-start ${getActionColor(log.action_type)}`}
                        >
                          {log.action_type}
                        </Badge>
                        <span className="flex items-center gap-1 text-[10px] text-gray-600 font-mono">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(log.created_at)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300 break-words">
                        <span className="text-gray-200 font-medium">
                          @{log.moderator?.username || 'System'}
                        </span>
                        {' → '}
                        <span className="text-gray-400">
                          @{log.target_user?.username || 'Unknown'}
                        </span>
                      </p>

                      {log.reason && (
                        <p className="text-xs text-gray-500 mt-1 italic">
                          "{log.reason}"
                        </p>
                      )}
                    </div>

                    {/* Right side - moderator shield */}
                    <div className="hidden sm:block flex-shrink-0">
                      <Shield className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center items-center gap-4 py-6 border-t border-[#2A2A2C] bg-[#111112]/30">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 text-xs border border-[#2A2A2C] bg-[#161618] text-gray-400 rounded-full hover:text-white hover:border-gray-600 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <span className="text-xs font-bold font-mono text-gray-500">
                {meta.current_page} OF {meta.last_page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
                disabled={page === meta.last_page}
                className="flex items-center gap-1.5 px-4 py-2 text-xs border border-[#2A2A2C] bg-[#161618] text-gray-400 rounded-full hover:text-white hover:border-gray-600 disabled:opacity-30 transition-all"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </Card>
      </div>
    </ResponsiveLayout>
  );
}