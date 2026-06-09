import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Hash } from 'lucide-react';
import { getAllTags } from '../../features/Common/F5_FilterByTag/api';

export default function TagsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getAllTags,
  });

  const tags = data?.data?.data || data?.data || [];

  if (isLoading) return (
    <div className="flex justify-center p-20"><Loader2 className="animate-spin text-[#D4AF37]" /></div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Explore Tags</h1>
      
      {Array.isArray(tags) && tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tags.map((tag: any) => (
            <Link 
              key={tag.id} 
              to={`/tags/${tag.slug}`}
              className="p-4 bg-[#161618] border border-[#2A2A2C] rounded-xl hover:border-[#D4AF37] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0B0B0C] rounded-lg text-[#D4AF37]">
                  <Hash className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-white group-hover:text-[#D4AF37]">{tag.name}</h2>
                  <p className="text-xs text-zinc-500">{tag.posts_count || 0} Postingan</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-[#2A2A2C] rounded-xl">
          <p className="text-zinc-500 font-fira-code">Belum ada tag yang tersedia di database.</p>
        </div>
      )}
    </div>
  );
}
