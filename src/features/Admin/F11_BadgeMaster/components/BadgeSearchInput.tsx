// src/features/Admin/F11_BadgeMaster/components/BadgeSearchInput.tsx
import { Search } from 'lucide-react';

interface BadgeSearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function BadgeSearchInput({ searchQuery, setSearchQuery }: BadgeSearchInputProps) {
  return (
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
  );
}
