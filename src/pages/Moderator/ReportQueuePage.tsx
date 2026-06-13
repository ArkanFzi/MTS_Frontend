// src/pages/Moderator/ReportQueuePage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Filter } from 'lucide-react';
import { getReports, updateReport } from '../../features/Moderator/F13_ReportQueue/api';
import type { Report, UpdateReportPayload, FilterStatus } from '../../features/Moderator/F13_ReportQueue/types';
import { FILTER_OPTIONS } from '../../features/Moderator/F13_ReportQueue/types';
import ReportListRow from '../../features/Moderator/F13_ReportQueue/components/ReportListRow';
import ActionReasonModal from '../../features/Moderator/F13_ReportQueue/components/ActionReasonModal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export default function ReportQueuePage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState<{
    open: boolean;
    report: Report | null;
    action: 'resolved' | 'dismissed';
  }>({ open: false, report: null, action: 'resolved' });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['moderator-reports', page],
    queryFn: () => getReports(page),
  });

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateReportPayload }) =>
      updateReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderator-reports'] });
      toast.success('Report status updated successfully.');
      setModalState({ open: false, report: null, action: 'resolved' });
    },
    onError: () => {
      toast.error('Failed to update report status.');
    },
  });

  const reports = data?.data?.data || [];
  const meta = data?.data;

  const filteredReports = statusFilter === 'all'
    ? reports
    : reports.filter((r: Report) => r.status === statusFilter);

  const pendingCount = reports.filter((r: Report) => r.status === 'pending').length;

  const handleAction = (report: Report, action: 'resolved' | 'dismissed') => {
    setModalState({ open: true, report, action });
  };

  const handleSubmitAction = (extra: Omit<UpdateReportPayload, 'status'>) => {
    if (!modalState.report) return;
    mutation.mutate({
      id: modalState.report.id,
      payload: {
        status: modalState.action,
        ...extra,
      },
    });
  };

  const handleView = (report: Report) => {
    if (report.target_type === 'post') {
      window.open(`/posts/${report.target_id}`, '_blank');
    } else {
      alert(`Fitur view untuk tipe ${report.target_type} dengan ID ${report.target_id} belum tersedia sepenuhnya karena membutuhkan context tambahan.`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#D4AF37]" />
          <div>
            <h1 className="text-2xl font-bold text-white">Report Queue</h1>
            <p className="text-sm text-gray-500">
              {pendingCount > 0
                ? `${pendingCount} pending reports need attention`
                : 'All reports handled'}
            </p>
          </div>
        </div>
        {pendingCount > 0 && (
          <Badge className="bg-amber-950/50 text-amber-400 border-amber-800 text-xs">
            {pendingCount} Pending
          </Badge>
        )}
      </div>

      {/* Filter tabs */}
      <Card className="border-[#2A2A2C] bg-[#161618] mb-4">
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500 mr-1" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                  statusFilter === opt.value
                    ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] font-medium'
                    : 'border-[#2A2A2C] bg-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports list */}
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardHeader className="pb-2 border-b border-[#2A2A2C]">
          <CardTitle className="text-sm font-medium text-gray-300">
            Reports ({filteredReports.length})
          </CardTitle>
          {meta && (
            <CardDescription className="text-[10px] text-gray-600">
              Page {meta.current_page} of {meta.last_page} &bull; {meta.total} total
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <LoadingSpinner text="Loading reports..." />
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-red-400 text-sm">Failed to load reports.</p>
            </div>
          )}

          {!isLoading && !isError && filteredReports.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No reports found for this filter.</p>
            </div>
          )}

          {filteredReports.map((report: Report) => (
            <ReportListRow
              key={report.id}
              report={report}
              onView={handleView}
              onAction={handleAction}
            />
          ))}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.current_page < meta.last_page && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-6 py-2 text-sm border border-[#2A2A2C] text-[#D4AF37] rounded-md hover:bg-[#161618] transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Action modal */}
      <ActionReasonModal
        open={modalState.open}
        onOpenChange={(open) => setModalState((s) => ({ ...s, open }))}
        action={modalState.action}
        onSubmit={handleSubmitAction}
        isLoading={mutation.isPending}
      />
    </div>
  );
}
