// src/features/Admin/F11_BadgeMaster/components/BadgeTableRow.tsx
import { Pencil, Trash2 } from 'lucide-react';
import BadgeTierIcon from './BadgeTierIcon';
import { getTierConfig } from '../constants';
import type { Badge } from '../types';

interface BadgeTableRowProps {
  badge: Badge;
  onEdit: (badge: Badge) => void;
  onDelete: (badge: Badge) => void;
}

export default function BadgeTableRow({ badge, onEdit, onDelete }: BadgeTableRowProps) {
  const tierCfg = getTierConfig(badge.tier);
  const isPlatinumOrDiamond = badge.tier === 'platinum' || badge.tier === 'diamond';

  return (
    <tr className="hover:bg-zinc-900/20 transition-colors group">
      <td className="py-4 px-4 font-mono font-medium text-emerald-500 tracking-wide">
        {badge.id.slice(0, 9)}…
      </td>
      <td className="py-4 px-4">
        <div
          className={`w-10 h-10 mx-auto bg-[#0B0B0C] border ${
            isPlatinumOrDiamond ? `${tierCfg.border} shadow-[0_0_8px_rgba(129,140,248,0.2)]` : 'border-zinc-800'
          } rounded-lg flex items-center justify-center`}
        >
          <BadgeTierIcon tier={badge.tier} />
        </div>
      </td>
      <td className="py-4 px-4 font-medium text-zinc-200">{badge.name}</td>
      <td className="py-4 px-4">
        <span
          className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider border uppercase ${tierCfg.border} ${tierCfg.text} ${tierCfg.bg}`}
        >
          {tierCfg.label}
        </span>
      </td>
      <td className="py-4 px-4 font-mono text-zinc-400">
        {badge.condition_type || '—'}
      </td>
      <td className="py-4 px-4 text-right font-semibold text-zinc-300 font-mono">
        {badge.condition_value?.toLocaleString() || '—'}
      </td>
      <td className="py-4 px-4 text-zinc-500 truncate max-w-[220px]">
        {badge.description || '—'}
      </td>
      <td className="py-4 px-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={() => onEdit(badge)}
            className="p-1.5 text-zinc-500 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 hover:text-white transition-colors"
            title="Edit"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDelete(badge)}
            className="p-1.5 text-red-500 bg-red-950/10 border border-red-900/20 rounded-md hover:bg-red-950/30 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </td>
    </tr>
  );
}
