<<<<<<< HEAD
  import { Link } from 'react-router-dom';
  import { useQuery } from '@tanstack/react-query';
  import { Loader2, Hash, Tag } from 'lucide-react';
  import { getAllTags } from '../../features/Common/F5_FilterByTag/api';
  import ResponsiveLayout from '../../components/shared/ResponsiveLayout';
=======
import TagGrid from '../../features/Common/F5_FilterByTag/components/TagGrid';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { getAllTags } from '../../features/Common/F5_FilterByTag/api';
>>>>>>> 71988fb7b4bd73adbd625c7eb17cef447e960735

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
      <ResponsiveLayout>
<div className="w-full py-8">
        {/* Header dengan ikon Tags */}
        <div className="flex items-center gap-3 mb-8">
          <div className="">
            <Tag className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Explore Tags</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Temukan topik favoritmu</p>
          </div>
        </div>
          
          {Array.isArray(tags) && tags.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {tags.map((tag: any) => (
                <Link 
                  key={tag.id} 
                  to={`/tags/${tag.slug}`}
                  className="relative p-5 bg-[#161618] border border-[#2A2A2C] rounded-2xl hover:border-[#D4AF37]/40 hover:bg-[#1a1a1c] transition-all duration-300 ease-in-out group hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div className="p-3 bg-[#0B0B0C] border border-[#2A2A2C] rounded-xl text-[#D4AF37] group-hover:border-[#D4AF37]/30 transition-all duration-300">
                      <Hash className="w-5 h-5" />
                    </div>
                    
                    {/* Text Container */}
                    <div>
                      <h2 className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1">
                        {tag.name}
                      </h2>
                      <div className="mt-1.5 flex items-center">
                        <span className="inline-flex items-center text-xs font-medium text-zinc-400 font-fira-code">
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
      </ResponsiveLayout>
    );
  }
      
      {Array.isArray(tags) && (
        <TagGrid tags={tags} />
      )}
    </div>
  );
}
