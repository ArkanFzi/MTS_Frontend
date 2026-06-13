import { useQuery } from "@tanstack/react-query";
import { Loader2, Tag } from "lucide-react";
import { getAllTags } from "../../features/Common/F5_FilterByTag/api";
import TagGrid from "../../features/Common/F5_FilterByTag/components/TagGrid";
import ResponsiveLayout from "../../components/shared/ResponsiveLayout";

export default function TagsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getAllTags,
  });

  const tags = data?.data?.data || data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="w-full py-8">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-8">
          <div>
            <Tag className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Explore Tags</h1>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
              Temukan topik favoritmu
            </p>
          </div>
        </div>

        {/* ── Tag Grid ── */}
        <TagGrid tags={tags} />
      </div>
    </ResponsiveLayout>
  );
}
