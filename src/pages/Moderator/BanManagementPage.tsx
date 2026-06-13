import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getBans } from '../../features/Moderator/F15_UserBanSanction/api';
import WarnUserModal from '../../features/Moderator/F15_UserBanSanction/components/WarnUserModal';
import BanUserModal from '../../features/Moderator/F15_UserBanSanction/components/BanUserModal';
import UnbanUserModal from '../../features/Moderator/F15_UserBanSanction/components/UnbanUserModal';
import UserSanctionRow from '../../features/Moderator/F15_UserBanSanction/components/UserSanctionRow';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import type { User } from '../../types';

export default function BanManagementPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isWarnOpen, setIsWarnOpen] = useState(false);
  const [isBanOpen, setIsBanOpen] = useState(false);
  const [isUnbanOpen, setIsUnbanOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-bans', page, debouncedSearch],
    queryFn: () => getBans(page, debouncedSearch),
  });

  const users = data?.data?.data || [];
  const meta = data?.data;

  const handleWarn = (user: User) => { setSelectedUser(user); setIsWarnOpen(true); };
  const handleBan = (user: User) => { setSelectedUser(user); setIsBanOpen(true); };
  const handleUnban = (user: User) => { setSelectedUser(user); setIsUnbanOpen(true); };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 font-['Inter']">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Ban Management</h1>
            <p className="text-sm text-gray-500">Manage user sanctions, warnings, and account bans.</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-[#2A2A2C] bg-[#161618] mb-4">
        <CardContent className="p-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0B0C] border border-[#2A2A2C] rounded-md pl-9 pr-3 py-2 text-xs text-gray-200 placeholder:text-gray-600 outline-none focus:border-red-500/50 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="border-[#2A2A2C] bg-[#161618]">
        <CardHeader className="pb-2 border-b border-[#2A2A2C]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-300">Users Directory</CardTitle>
            {meta && (
              <CardDescription className="text-[10px] text-gray-600">
                Page {meta.current_page} of {meta.last_page} &bull; Total {meta.total} users
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

          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#2A2A2C] bg-[#0B0B0C] text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6 font-semibold">User</th>
                    <th className="py-3 px-6 font-semibold">Email</th>
                    <th className="py-3 px-6 font-semibold text-center">Status</th>
                    <th className="py-3 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2C] text-sm">
                  {users.map((user: User) => (
                    <UserSanctionRow
                      key={user.id}
                      user={user}
                      onWarn={handleWarn}
                      onBan={handleBan}
                      onUnban={handleUnban}
                    />
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="border-[#2A2A2C] text-gray-400 hover:text-white hover:bg-[#161618] px-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Prev
          </Button>
          <span className="text-xs font-mono text-gray-500">{meta.current_page} / {meta.last_page}</span>
          <Button
            variant="outline"
            disabled={page === meta.last_page}
            onClick={() => setPage((p) => Math.min(p + 1, meta.last_page))}
            className="border-[#2A2A2C] text-gray-400 hover:text-white hover:bg-[#161618] px-4"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Modals */}
      {selectedUser && (
        <WarnUserModal
          open={isWarnOpen}
          onOpenChange={setIsWarnOpen}
          userId={selectedUser.id}
          username={selectedUser.username}
        />
      )}
      <BanUserModal user={selectedUser} isOpen={isBanOpen} onClose={() => setIsBanOpen(false)} />
      <UnbanUserModal user={selectedUser} isOpen={isUnbanOpen} onClose={() => setIsUnbanOpen(false)} />
    </div>
  );
}
