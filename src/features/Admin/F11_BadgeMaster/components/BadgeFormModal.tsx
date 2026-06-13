// src/features/Admin/F11_BadgeMaster/components/BadgeFormModal.tsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Badge, BadgeTier, ConditionType, CreateBadgePayload } from '../types';

const TIER_OPTIONS: { value: BadgeTier; label: string; color: string }[] = [
  { value: 'bronze',   label: 'Bronze',   color: 'text-orange-400' },
  { value: 'silver',   label: 'Silver',   color: 'text-slate-300' },
  { value: 'gold',     label: 'Gold',     color: 'text-amber-400' },
  { value: 'platinum', label: 'Platinum', color: 'text-indigo-400' },
  { value: 'diamond',  label: 'Diamond',  color: 'text-cyan-400' },
];

const CONDITION_OPTIONS: { value: ConditionType; label: string }[] = [
  { value: 'reputation_points', label: 'Reputation Points' },
  { value: 'post_count',        label: 'Post Count' },
  { value: 'comment_count',     label: 'Comment Count' },
  { value: 'upvote_received',   label: 'Upvotes Received' },
  { value: 'answer_accepted',   label: 'Answers Accepted' },
];

interface BadgeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBadgePayload) => void;
  editingBadge: Badge | null;
  isSubmitting: boolean;
}

const emptyForm: CreateBadgePayload = {
  name: '',
  description: '',
  icon_url: '',
  tier: 'bronze',
  condition_type: 'reputation_points',
  condition_value: 1,
};

export default function BadgeFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingBadge,
  isSubmitting,
}: BadgeFormModalProps) {
  const [form, setForm] = useState<CreateBadgePayload>(emptyForm);

  useEffect(() => {
    if (editingBadge) {
      setForm({
        name: editingBadge.name,
        description: editingBadge.description || '',
        icon_url: editingBadge.icon_url || '',
        tier: editingBadge.tier || 'bronze',
        condition_type: editingBadge.condition_type || 'reputation_points',
        condition_value: editingBadge.condition_value || 1,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingBadge, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateBadgePayload, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-[#161618] border border-zinc-800 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">
            {editingBadge ? 'Edit Badge' : 'Create New Badge'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Badge Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Suhu Master"
              className="w-full px-4 py-2.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              required
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Awarded for reaching..."
              rows={2}
              className="w-full px-4 py-2.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#D4AF37]/50 transition-colors resize-none"
            />
          </div>

          {/* Tier + Condition Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Tier
              </label>
              <select
                value={form.tier}
                onChange={(e) => handleChange('tier', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-sm text-zinc-200 outline-none focus:border-[#D4AF37]/50 transition-colors"
              >
                {TIER_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Condition Type
              </label>
              <select
                value={form.condition_type}
                onChange={(e) => handleChange('condition_type', e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-sm text-zinc-200 outline-none focus:border-[#D4AF37]/50 transition-colors"
              >
                {CONDITION_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition Value */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Target Value
            </label>
            <input
              type="number"
              required
              min={1}
              value={form.condition_value}
              onChange={(e) => handleChange('condition_value', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-sm text-zinc-200 outline-none focus:border-[#D4AF37]/50 transition-colors font-mono"
            />
          </div>

          {/* Icon URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Icon URL
            </label>
            <input
              type="url"
              required
              value={form.icon_url}
              onChange={(e) => handleChange('icon_url', e.target.value)}
              placeholder="https://example.com/icon.svg"
              className="w-full px-4 py-2.5 bg-[#0B0B0C] border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-black bg-[#D4AF37] rounded-lg hover:bg-[#c29f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Saving...'
                : editingBadge
                  ? 'Update Badge'
                  : '+ Create Badge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
