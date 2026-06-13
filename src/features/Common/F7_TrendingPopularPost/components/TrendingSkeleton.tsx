// src/features/Common/F7_TrendingPopularPost/components/TrendingSkeleton.tsx
import { Skeleton } from '../../../../components/ui/skeleton';

export default function TrendingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-5 p-5 rounded-2xl border border-[#2A2A2C] bg-[#161618] relative overflow-hidden"
        >
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <Skeleton className="w-10 h-10 rounded-xl bg-[#2A2A2C]" />
          <div className="flex-1 space-y-4">
            <div className="flex gap-2">
              <Skeleton className="w-16 h-5 rounded-md bg-[#2A2A2C]" />
              <Skeleton className="w-24 h-5 rounded-md bg-[#2A2A2C]" />
            </div>
            <Skeleton className="w-4/5 h-6 rounded-md bg-[#2A2A2C]" />
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-full bg-[#2A2A2C]" />
              <Skeleton className="w-40 h-4 rounded-md bg-[#2A2A2C]" />
            </div>
          </div>
          <div className="flex gap-2 hidden sm:flex">
            <Skeleton className="w-[80px] h-14 rounded-xl bg-[#2A2A2C]" />
            <Skeleton className="w-[80px] h-14 rounded-xl bg-[#2A2A2C]" />
          </div>
        </div>
      ))}
    </div>
  );
}
