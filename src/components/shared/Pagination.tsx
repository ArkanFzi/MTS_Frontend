import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  current: number;
  last: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ current, last, onPageChange }: PaginationProps) {
  if (last <= 1) return null;

  const pages: (number | string)[] = [];
  const delta = 2;

  for (let i = 1; i <= last; i++) {
    if (
      i === 1 ||
      i === last ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 pb-8">
      <button
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
        className="px-3 py-1.5 text-xs font-medium border border-[#2A2A2C] rounded text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button
            key={i}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1.5 text-xs font-medium border rounded transition-colors min-w-[32px] ${
              p === current
                ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold"
                : "border-[#2A2A2C] text-gray-400 hover:text-white hover:border-gray-600 bg-transparent"
            }`}
          >
            {p}
          </button>
        ) : (
          <span key={i} className="px-1 text-gray-500">
            ...
          </span>
        ),
      )}

      <button
        onClick={() => onPageChange(current + 1)}
        disabled={current === last}
        className="px-3 py-1.5 text-xs font-medium border border-[#2A2A2C] rounded text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
