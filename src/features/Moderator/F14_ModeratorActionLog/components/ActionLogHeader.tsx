// src/features/Moderator/F14_ModeratorActionLog/components/ActionLogHeader.tsx
import { ShieldCheck, Search } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';

interface ActionLogHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function ActionLogHeader({ searchQuery, onSearchChange }: ActionLogHeaderProps) {
  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-zinc-800">
      <div className="space-y-1">
        <CardTitle className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-lime-500" /> Log Tindakan Moderator
        </CardTitle>
        <CardDescription className="text-zinc-400 text-sm">
          Rekam jejak transparansi seluruh moderasi konten yang dilakukan tim staf.
        </CardDescription>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari moderator atau target..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0B0B0C] border border-zinc-800 pl-9 pr-4 py-2 text-xs rounded outline-none focus:border-zinc-600 text-zinc-300 font-mono placeholder:text-zinc-600 transition-all"
          />
        </div>
      </div>
    </CardHeader>
  );
}
