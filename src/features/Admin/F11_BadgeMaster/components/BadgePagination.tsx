// src/features/Admin/F11_BadgeMaster/components/BadgePagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BadgePaginationProps {
  current: number;
  last: number;
  total: number;
  perPage: number;
  onPageChange: (p: number) => void;
}

export default function BadgePagination({ current, last, total, perPage, onPageChange }: BadgePaginationProps) {
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
