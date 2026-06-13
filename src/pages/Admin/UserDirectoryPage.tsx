// src/pages/Admin/UserDirectoryPage.tsx
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react'; // Menggunakan Left & Right
import { getUsers } from '../../features/Admin/F9_UserManagement/api';
import UserTable from '../../features/Admin/F9_UserManagement/components/UserTable';
import UserSearchBar from '../../features/Admin/F9_UserManagement/components/UserSearchBar';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

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
    <div className="max-w-6xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#D4AF37]" />
          <div>
            <h1 className="text-2xl font-bold text-white">User Directory</h1>
            <p className="text-sm text-gray-500">
              {meta ? `${meta.total} registered users` : 'Loading...'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <UserSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* User Table Card */}
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardHeader className="pb-2 border-b border-[#2A2A2C]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-300">
              Users ({users.length})
            </CardTitle>
            {meta && (
              <CardDescription className="text-[10px] text-gray-600">
                Page {meta.current_page} of {meta.last_page}
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

          {/* Langsung kirim array 'users' hasil data API asli tanpa double filter */}
          {!isLoading && !isError && <UserTable users={users} />}
        </CardContent>
      </Card>

      {/* Pagination Controls (Prev / Next) */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-4 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>

          <span className="text-xs font-mono text-gray-400">
            {meta.current_page} / {meta.last_page}
          </span>

          <Button
            variant="outline"
            disabled={page === meta.last_page}
            onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
            className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-4 disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}