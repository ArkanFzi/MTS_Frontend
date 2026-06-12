// src/pages/Admin/UserDirectoryPage.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, ChevronDown } from 'lucide-react';
import { getUsers } from '../../features/Admin/F9_UserManagement/api';
import UserTable from '../../features/Admin/F9_UserManagement/components/UserTable';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

export default function UserDirectoryPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => getUsers(page),
  });

  const users = data?.data || [];
  const meta = data?.meta;

  const filteredUsers = searchQuery.trim()
    ? users.filter(
        (u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

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

      {/* Search */}
      <Card className="border-[#2A2A2C] bg-[#161618] mb-4">
        <CardContent className="p-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-md pl-9 pr-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* User table */}
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardHeader className="pb-2 border-b border-[#2A2A2C]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-300">
              Users ({filteredUsers.length})
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

          {!isLoading && !isError && <UserTable users={filteredUsers} />}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.current_page < meta.last_page && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            className="border-[#2A2A2C] text-[#D4AF37] hover:bg-[#161618] px-8 gap-2"
          >
            Load More
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
