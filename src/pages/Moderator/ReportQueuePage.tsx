// src/pages/Moderator/ReportQueuePage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Filter as FilterIcon } from 'lucide-react';
import { getReports, updateReport } from '../../features/Moderator/F13_ReportQueue/api';
import type { Report, UpdateReportPayload, FilterStatus } from '../../features/Moderator/F13_ReportQueue/types';
import { FILTER_OPTIONS } from '../../features/Moderator/F13_ReportQueue/types';
import ReportListRow from '../../features/Moderator/F13_ReportQueue/components/ReportListRow';
import ActionReasonModal from '../../features/Moderator/F13_ReportQueue/components/ActionReasonModal';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

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
      payload: { status: modalState.action, ...extra },
    });
  };

  const handleView = (report: Report) => {
    if (report.target_type === 'post') {
      window.open(`/posts/${report.target_id}`, '_blank');
    }
  };

  return (
    <ResponsiveLayout>
      <div className="w-full py-6 md:py-8 px-4 md:px-0">
        
        {/* ── Header Responsif ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Report Queue</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {pendingCount > 0 ? `${pendingCount} pending reports need attention` : 'All reports handled'}
              </p>
            </div>
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-amber-950/50 text-amber-400 border border-amber-900/60 rounded-full px-3 py-1 text-xs w-fit sm:w-auto">
              {pendingCount} Pending
            </Badge>
          )}
        </div>

        {/* ── Filter Tabs: Scrollable Touch-Friendly ── */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <FilterIcon className="w-4 h-4 text-gray-500 shrink-0" />
          <div className="flex gap-2">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all whitespace-nowrap ${
                  statusFilter === opt.value
                    ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10 text-[#D4AF37] font-bold'
                    : 'border-[#2A2A2C] bg-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Reports List ── */}
        <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden w-full">
          <CardHeader className="pb-3 pt-4 px-4 sm:px-6 border-b border-[#2A2A2C]">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">
              Reports ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 w-full overflow-x-auto sm:overflow-x-visible">
            <div className="min-w-full inline-block align-middle">
              {isLoading && (
                <div className="p-12 flex justify-center items-center w-full">
                  <LoadingSpinner />
                </div>
              )}
              
              {!isLoading && filteredReports.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-xs sm:text-sm px-4">
                  No reports found.
                </div>
              )}

              <div className="divide-y divide-[#2A2A2C]/60 w-full">
                {filteredReports.map((report: Report) => (
                  <ReportListRow
                    key={report.id}
                    report={report}
                    onView={handleView}
                    onAction={handleAction}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Load More Button ── */}
        {meta && meta.current_page < meta.last_page && (
          <div className="flex justify-center mt-6 md:mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] w-full sm:w-auto sm:px-8 h-10 gap-2 rounded-full font-bold text-xs"
            >
              Load More
            </Button>
          </div>
        )}

        <ActionReasonModal
          open={modalState.open}
          onOpenChange={(open) => setModalState((s) => ({ ...s, open }))}
          action={modalState.action}
          onSubmit={handleSubmitAction}
          isLoading={mutation.isPending}
        />
      </div>
    </ResponsiveLayout>
  );
}