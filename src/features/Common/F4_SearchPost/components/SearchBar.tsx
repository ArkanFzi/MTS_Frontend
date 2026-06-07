import { useState } from 'react';

import { Search } from 'lucide-react';
import { Input } from '../../../../components/ui/input';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (keyword: string) => void;
}

export function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(keyword);
    }
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input 
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Cari postingan, error, atau topik..."
        className="pl-10 pr-4 py-6 bg-[#161618] border-gray-800 text-white w-full rounded-lg focus-visible:ring-[#D4AF37]"
      />
    </div>
  );
}