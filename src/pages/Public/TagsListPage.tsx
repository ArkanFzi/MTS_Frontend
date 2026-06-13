import TagGrid from '../../features/Common/F5_FilterByTag/components/TagGrid';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { getAllTags } from '../../features/Common/F5_FilterByTag/api';

export default function TagsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
  });

  const tags = data?.data?.data || data?.data || [];

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
          Explore Tags
        </h1>
        <p className="text-sm text-zinc-500 font-fira-code">
          Telusuri topik dan kategori yang tersedia di sistem.
        </p>
      </div>
      
      {Array.isArray(tags) && (
        <TagGrid tags={tags} />
      )}
    </div>
  );
}