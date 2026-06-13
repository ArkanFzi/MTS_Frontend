// src/features/Admin/F9_UserManagement/components/UserSearchBar.tsx
import { Search } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';

interface UserSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function UserSearchBar({ searchQuery, setSearchQuery }: UserSearchBarProps) {
  return (
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
  );
}
