// src/pages/Moderator/ActionLogPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '../../components/ui/card';
import ActionLogHeader from '../../features/Moderator/F14_ModeratorActionLog/components/ActionLogHeader';
import ActionLogTable from '../../features/Moderator/F14_ModeratorActionLog/components/ActionLogTable';
import { getModerationLogs } from '../../features/Moderator/F14_ModeratorActionLog/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ActionLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const handler = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['moderator-logs', page, debouncedSearch],
    queryFn: () => getModerationLogs(page),
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 font-['Inter'] text-white">
      <Card className="bg-[#161618] border border-zinc-800 shadow-2xl rounded-none md:rounded-lg">
        {/* HEADER AREA */}
        <ActionLogHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        {/* TABLE AREA */}
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <LoadingSpinner text="Loading moderation logs..." />
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-red-400 text-sm">Failed to load moderation logs.</p>
            </div>
          )}

          {!isLoading && !isError && <ActionLogTable logs={logs} />}
        </CardContent>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center items-center gap-4 py-4 border-t border-zinc-800">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs border border-zinc-800 text-zinc-400 rounded hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <span className="text-xs font-mono text-zinc-500">
              {meta.current_page} / {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
              disabled={page === meta.last_page}
              className="px-3 py-1.5 text-xs border border-zinc-800 text-zinc-400 rounded hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
