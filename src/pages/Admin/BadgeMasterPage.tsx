// src/pages/Admin/BadgeMasterPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { getBadges, createBadge, updateBadge, deleteBadge } from '../../features/Admin/F11_BadgeMaster/api';
import type { Badge, CreateBadgePayload } from '../../features/Admin/F11_BadgeMaster/types';
import BadgeFormModal from '../../features/Admin/F11_BadgeMaster/components/BadgeFormModal';
import BadgeTableRow from '../../features/Admin/F11_BadgeMaster/components/BadgeTableRow';
import BadgePagination from '../../features/Admin/F11_BadgeMaster/components/BadgePagination';
import DeleteBadgeModal from '../../features/Admin/F11_BadgeMaster/components/DeleteBadgeModal';
import BadgeTableSkeleton from '../../features/Admin/F11_BadgeMaster/components/BadgeTableSkeleton';
import BadgeSearchInput from '../../features/Admin/F11_BadgeMaster/components/BadgeSearchInput';

export function BadgeMasterPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [deletingBadge, setDeletingBadge] = useState<Badge | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'badges', page],
    queryFn: () => getBadges(),
  });

  const paginator = data?.data;
  const badges = paginator?.data || [];
  const currentPage = paginator?.current_page || 1;
  const lastPage = paginator?.last_page || 1;
  const total = paginator?.total || 0;
  const perPage = paginator?.per_page || 15;

  const createMutation = useMutation({
    mutationFn: (payload: CreateBadgePayload) => createBadge(payload),
    onSuccess: () => {
      toast.success('Badge created successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'badges'] });
      setIsFormOpen(false);
    },
    onError: () => toast.error('Failed to create badge.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateBadgePayload }) => updateBadge(id, payload),
    onSuccess: () => {
      toast.success('Badge updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'badges'] });
      setIsFormOpen(false);
      setEditingBadge(null);
    },
    onError: () => toast.error('Failed to update badge.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBadge(id),
    onSuccess: () => {
      toast.success('Badge deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'badges'] });
      setDeletingBadge(null);
    },
    onError: () => toast.error('Failed to delete badge.'),
  });

  const openCreate = () => { setEditingBadge(null); setIsFormOpen(true); };
  const openEdit = (badge: Badge) => { setEditingBadge(badge); setIsFormOpen(true); };

  const handleFormSubmit = (payload: CreateBadgePayload) => {
    if (editingBadge) {
      updateMutation.mutate({ id: editingBadge.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = () => {
    if (deletingBadge) deleteMutation.mutate(deletingBadge.id);
  };

  const filteredBadges = searchQuery.trim()
    ? badges.filter(
        (b) =>
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : badges;

  return (
    <div className="w-full min-h-screen bg-[#0B0B0C] text-white p-6 sm:p-10 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Badge Master</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Manage platform achievements and progression entities.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c29f2f] text-black text-xs font-bold rounded-lg tracking-wide transition-colors"
          >
            + CREATE BADGE
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          <BadgeSearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {isError && (
            <p className="text-red-400 text-center py-8">Failed to load badges. Please refresh.</p>
          )}

          {isLoading && (
            <BadgeTableSkeleton />
          )}

          {!isLoading && !isError && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-950/20">
                    <th className="py-3 px-4 font-semibold">Badge UUID</th>
                    <th className="py-3 px-4 font-semibold text-center">Thumbnail</th>
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Tier</th>
                    <th className="py-3 px-4 font-semibold">Condition Type</th>
                    <th className="py-3 px-4 font-semibold text-right">Target Val</th>
                    <th className="py-3 px-4 max-w-[220px]">Description</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40 text-xs">
                  {filteredBadges.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-zinc-500">
                        {searchQuery ? 'No badges match your search.' : 'No badges found.'}
                      </td>
                    </tr>
                  )}
                  {filteredBadges.map((badge) => (
                    <BadgeTableRow
                      key={badge.id}
                      badge={badge}
                      onEdit={openEdit}
                      onDelete={setDeletingBadge}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && !isError && (
            <BadgePagination
              current={currentPage}
              last={lastPage}
              total={total}
              perPage={perPage}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      <BadgeFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingBadge(null); }}
        onSubmit={handleFormSubmit}
        editingBadge={editingBadge}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <DeleteBadgeModal
        badge={deletingBadge}
        onClose={() => setDeletingBadge(null)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default BadgeMasterPage;
