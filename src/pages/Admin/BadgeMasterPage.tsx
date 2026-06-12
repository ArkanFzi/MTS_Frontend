// src/pages/Admin/BadgeMasterPage.tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search, ChevronLeft, ChevronRight,
  Award, MessageSquare, ThumbsUp, Shield, Gem, Trash2, Pencil,
} from 'lucide-react';
import { toast } from 'sonner';

import { getBadges, createBadge, updateBadge, deleteBadge } from '../../features/Admin/F11_BadgeMaster/api';
import type { Badge, CreateBadgePayload } from '../../features/Admin/F11_BadgeMaster/types';
import BadgeFormModal from '../../features/Admin/F11_BadgeMaster/components/BadgeFormModal';
import { Skeleton } from '../../components/ui/skeleton';

// ─── Tier styling helpers ─────────────────────────────────────────────────────
const TIER_CONFIG: Record<string, { label: string; border: string; text: string; bg: string; icon: typeof Award }> = {
  bronze:   { label: 'BRONZE',   border: 'border-orange-700/50', text: 'text-orange-400',   bg: 'bg-orange-700/10',  icon: ThumbsUp },
  silver:   { label: 'SILVER',   border: 'border-slate-500/50',  text: 'text-slate-300',    bg: 'bg-slate-500/10',   icon: MessageSquare },
  gold:     { label: 'GOLD',     border: 'border-amber-500/50',  text: 'text-amber-400',    bg: 'bg-amber-500/10',   icon: Award },
  platinum: { label: 'PLATINUM', border: 'border-indigo-500/50', text: 'text-indigo-400',   bg: 'bg-indigo-950/30',  icon: Shield },
  diamond:  { label: 'DIAMOND',  border: 'border-cyan-500/50',   text: 'text-cyan-400',     bg: 'bg-cyan-950/20',    icon: Gem },
};

function getTierConfig(tier: string | null) {
  return TIER_CONFIG[tier || 'bronze'] || TIER_CONFIG.bronze;
}

function TierIcon({ tier }: { tier: string | null }) {
  const cfg = getTierConfig(tier);
  const Icon = cfg.icon;
  const glowClass = tier === 'platinum' || tier === 'diamond' ? 'animate-pulse' : '';
  return <Icon className={`w-5 h-5 ${cfg.text} ${glowClass}`} />;
}

// ─── Pagination helper ─────────────────────────────────────────────────────────
function Pagination({
  current, last, total, perPage, onPageChange,
}: {
  current: number; last: number; total: number; perPage: number;
  onPageChange: (p: number) => void;
}) {
  if (last <= 1) return null;
  const from = (current - 1) * perPage + 1;
  const to = Math.min(current * perPage, total);

  const pages: (number | string)[] = [];
  const delta = 2;
  for (let i = 1; i <= last; i++) {
    if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
      <div>
        Showing <span className="text-zinc-400 font-medium">{from} to {to}</span> of{' '}
        <span className="text-zinc-400 font-medium">{total} entities</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current === 1}
          className="p-1.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        {pages.map((p, i) =>
          typeof p === 'number' ? (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors min-w-[32px] ${
                p === current
                  ? 'bg-[#0B0B0C] border border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-[#0B0B0C] border border-zinc-800 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-1 text-zinc-500">…</span>
          )
        )}
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current === last}
          className="p-1.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg hover:bg-zinc-900 text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Delete confirmation modal ─────────────────────────────────────────────────
function DeleteConfirmModal({
  badge, onClose, onConfirm, isDeleting,
}: {
  badge: Badge | null; onClose: () => void; onConfirm: () => void; isDeleting: boolean;
}) {
  if (!badge) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#161618] border border-zinc-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-red-950/30 border border-red-900/40">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Delete Badge</h3>
            <p className="text-xs text-zinc-500">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Are you sure you want to delete <span className="text-white font-semibold">"{badge.name}"</span>?
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Badge'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function BadgeMasterPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [deletingBadge, setDeletingBadge] = useState<Badge | null>(null);

  // Fetch badges
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

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (payload: CreateBadgePayload) => createBadge(payload),
    onSuccess: () => {
      toast.success('Badge created successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'badges'] });
      setIsFormOpen(false);
    },
    onError: () => toast.error('Failed to create badge.'),
  });

  // Update mutation
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBadge(id),
    onSuccess: () => {
      toast.success('Badge deleted.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'badges'] });
      setDeletingBadge(null);
    },
    onError: () => toast.error('Failed to delete badge.'),
  });

  const openCreate = () => {
    setEditingBadge(null);
    setIsFormOpen(true);
  };

  const openEdit = (badge: Badge) => {
    setEditingBadge(badge);
    setIsFormOpen(true);
  };

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
        {/* ── Header ── */}
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

        {/* ── Table Card ── */}
        <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-5 shadow-xl space-y-4">
          {/* Search bar */}
          <div className="relative w-full max-w-xs">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-zinc-500" />
            </span>
            <input
              type="text"
              placeholder="Search UUID or Name…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-zinc-700 transition-colors"
            />
          </div>

          {/* Error state */}
          {isError && (
            <p className="text-red-400 text-center py-8">Failed to load badges. Please refresh.</p>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 p-4 bg-[#0B0B0C]/50 rounded-lg">
                  <Skeleton className="w-20 h-4" />
                  <Skeleton className="w-10 h-10" />
                  <Skeleton className="flex-1 h-4" />
                  <Skeleton className="w-16 h-5" />
                </div>
              ))}
            </div>
          )}

          {/* Table */}
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
                  {filteredBadges.map((badge) => {
                    const tierCfg = getTierConfig(badge.tier);
                    const isPlatinumOrDiamond = badge.tier === 'platinum' || badge.tier === 'diamond';
                    return (
                      <tr key={badge.id} className="hover:bg-zinc-900/20 transition-colors group">
                        {/* UUID */}
                        <td className="py-4 px-4 font-mono font-medium text-emerald-500 tracking-wide">
                          {badge.id.slice(0, 9)}…
                        </td>

                        {/* Thumbnail */}
                        <td className="py-4 px-4">
                          <div
                            className={`w-10 h-10 mx-auto bg-[#0B0B0C] border ${
                              isPlatinumOrDiamond ? `${tierCfg.border} shadow-[0_0_8px_rgba(129,140,248,0.2)]` : 'border-zinc-800'
                            } rounded-lg flex items-center justify-center`}
                          >
                            <TierIcon tier={badge.tier} />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-4 px-4 font-medium text-zinc-200">{badge.name}</td>

                        {/* Tier label */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider border uppercase ${tierCfg.border} ${tierCfg.text} ${tierCfg.bg}`}
                          >
                            {tierCfg.label}
                          </span>
                        </td>

                        {/* Condition Type */}
                        <td className="py-4 px-4 font-mono text-zinc-400">
                          {badge.condition_type || '—'}
                        </td>

                        {/* Target Val */}
                        <td className="py-4 px-4 text-right font-semibold text-zinc-300 font-mono">
                          {badge.condition_value?.toLocaleString() || '—'}
                        </td>

                        {/* Description */}
                        <td className="py-4 px-4 text-zinc-500 truncate max-w-[220px]">
                          {badge.description || '—'}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEdit(badge)}
                              className="p-1.5 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeletingBadge(badge)}
                              className="p-1.5 text-red-500 bg-red-950/10 border border-red-900/20 rounded-md hover:bg-red-950/30 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !isError && (
            <Pagination
              current={currentPage}
              last={lastPage}
              total={total}
              perPage={perPage}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <BadgeFormModal
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingBadge(null); }}
        onSubmit={handleFormSubmit}
        editingBadge={editingBadge}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
      <DeleteConfirmModal
        badge={deletingBadge}
        onClose={() => setDeletingBadge(null)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default BadgeMasterPage;
