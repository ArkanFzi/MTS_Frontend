import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';

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

  const handleSubmit = () => {
    onSearch(keyword);
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <div className="relative w-full flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Cari postingan, error, atau topik..."
          className="pl-10 pr-9 py-5 bg-[#161618] border-[#2A2A2C] text-white w-full rounded-xl focus-visible:ring-[#D4AF37]/50 focus-visible:border-[#D4AF37]/50 text-sm"
        />
        {keyword && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        onClick={handleSubmit}
        className="bg-[#D4AF37] text-black hover:bg-[#c29f2f] font-bold text-sm px-5 h-[34px] rounded-xl flex-shrink-0"
      >
        Search
      </Button>
    </div>
  );
}
