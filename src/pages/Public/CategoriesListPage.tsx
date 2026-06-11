// src/pages/Public/CategoriesListPage.tsx

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import CategoryDiscoveryCard from '../../features/Common/F6_FilterByCategory/components/CategoryDiscoveryCard';
import { getCategoriesWithTags } from '../../features/Common/F6_FilterByCategory/api';

export default function CategoriesListPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories-with-tags'],
    queryFn: getCategoriesWithTags,
  });

  const categories = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Failed to load categories. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Explore Categories</h1>
        <p className="text-sm text-gray-500">
          Discover topics by category — click a tag to see posts filtered by both tag and category.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryDiscoveryCard key={cat.id} category={cat} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
          <p className="text-gray-500">No categories available yet.</p>
        </div>
      )}
    </div>
  );
}
