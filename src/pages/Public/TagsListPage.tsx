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
      
      {Array.isArray(tags) && tags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tags.map((tag: any) => (
            <Link 
              key={tag.id} 
              to={`/tags/${tag.slug}`}
              className="relative p-5 bg-[#161618] border border-[#2A2A2C] rounded-2xl hover:border-[#D4AF37]/40 hover:bg-[#1a1a1c] transition-all duration-300 ease-in-out group hover:-translate-y-1 overflow-hidden"
            >
              {/* Subtle Background Glow Effect on Hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-0 group-hover:opacity-[0.03] rounded-full blur-2xl transition-opacity duration-500" />
              
              <div className="flex items-center gap-4 relative z-10">
                {/* Icon Container */}
                <div className="p-3 bg-[#0B0B0C] border border-[#2A2A2C] rounded-xl text-[#D4AF37] group-hover:border-[#D4AF37]/30 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                  <Hash className="w-5 h-5" />
                </div>
                
                {/* Text Container */}
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1">
                    {tag.name}
                  </h2>
                  <div className="mt-1.5 flex items-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0B0B0C] border border-[#2A2A2C] text-xs font-medium text-zinc-400 font-fira-code">
                      {tag.usage_count || 0} Postingan
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 px-4 border border-dashed border-[#2A2A2C] bg-[#161618]/50 rounded-2xl">
          <div className="p-4 bg-[#0B0B0C] rounded-full mb-4 border border-[#2A2A2C]">
            <Hash className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400 font-fira-code text-sm text-center">
            Belum ada tag yang tersedia di database.
          </p>
        </div>
      )}
    </div>
  );
}