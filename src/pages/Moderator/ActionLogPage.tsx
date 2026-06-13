// src/pages/Moderator/ActionLogPage.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Search } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import ActionLogTable from '../../features/Moderator/F14_ModeratorActionLog/components/ActionLogTable';
import { getModerationLogs } from '../../features/Moderator/F14_ModeratorActionLog/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

export default function ActionLogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['moderator-logs', page, debouncedSearch],
    queryFn: () => getModerationLogs(page, debouncedSearch),
  });

  const logs = Array.isArray(data?.data?.data) ? data.data.data : [];
  const meta = data?.data;

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Action Logs</h1>
              <p className="text-sm text-gray-500">Transparansi rekam jejak moderasi tim staf.</p>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden shadow-none">
          
          {/* Integrated Search & Badge Area (Background Abu) */}
          <div className="bg-[#111112] border-b border-[#2A2A2C] p-6 space-y-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Cari moderator atau target..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161618] border border-[#2A2A2C] pl-10 pr-4 py-2.5 text-sm rounded-full outline-none focus:border-[#D4AF37]/50 text-white placeholder:text-gray-600 transition-all"
              />
            </div>
            
            {meta?.total !== undefined && (
              <div>
                <Badge className="bg-[#161618] text-gray-400 border border-[#2A2A2C] rounded-full px-4 py-1 text-[11px] font-mono shadow-sm">
                  {meta.total} TOTAL ACTIONS
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex justify-center"><LoadingSpinner /></div>
            ) : isError ? (
              <div className="text-center py-20 text-gray-500 text-sm">Terjadi kesalahan saat memuat data.</div>
            ) : (
              <ActionLogTable logs={logs} />
            )}
          </CardContent>
        </Card>

        {/* Load More Button */}
        {meta && meta.current_page < meta.last_page && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 rounded-full font-bold transition-all"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}