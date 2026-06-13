// src/pages/Admin/UserDirectoryPage.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUsers } from '../../features/Admin/F9_UserManagement/api';
import UserTable from '../../features/Admin/F9_UserManagement/components/UserTable';
import UserSearchBar from '../../features/Admin/F9_UserManagement/components/UserSearchBar';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import ResponsiveLayout from '../../components/shared/ResponsiveLayout';

export default function UserDirectoryPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Efek Debounce untuk pencarian server-side
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset kembali ke halaman 1 setiap kali mengetik kata kunci baru
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetching data berdasarkan page dan keyword pencarian terkini
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', page, debouncedSearch],
    queryFn: () => getUsers(page, debouncedSearch),
  });

  const users = data?.data?.data || [];
  const meta = data?.data;

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#D4AF37]" />
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">User Directory</h1>
              <p className="text-sm text-gray-500">
                {meta ? `${meta.total} registered users` : 'Loading system users...'}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <UserSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* User Table Card */}
        <Card className="border-[#2A2A2C] bg-[#161618] rounded-xl overflow-hidden shadow-none">
          <CardHeader className="pb-4 border-b border-[#2A2A2C] bg-[#111112]/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                Users ({users.length})
              </CardTitle>
              {meta && (
                <CardDescription className="text-xs font-mono text-gray-600">
                  Page {meta.current_page} / {meta.last_page}
                </CardDescription>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && (
              <div className="flex items-center justify-center p-12">
                <LoadingSpinner text="Loading users..." />
              </div>
            )}

            {isError && (
              <div className="text-center py-12">
                <p className="text-red-400 text-sm">Failed to load users.</p>
              </div>
            )}

            {!isLoading && !isError && <UserTable users={users} />}
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {meta && meta.last_page > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="border-[#2A2A2C] bg-[#161618] text-[#D4AF37] hover:bg-[#202022] rounded-full px-6 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Prev
            </Button>

            <span className="text-xs font-bold font-mono text-gray-500">
              {meta.current_page} OF {meta.last_page}
            </span>

            <Button
              variant="outline"
              disabled={page === meta.last_page}
              onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
              className="border-[#2A2A2C] bg-[#161618] text-[#D4AF37] hover:bg-[#202022] rounded-full px-6 disabled:opacity-40"
            >
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}