// src/features/User/F16_Post/components/FeedSkeleton.tsx
import { Skeleton } from '../../../../components/ui/skeleton';

export default function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#161618] border border-[#2A2A2C] rounded-lg p-5">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-5" />
              <Skeleton className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-16 h-3" />
              </div>
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-2/3 h-4" />
              <div className="flex gap-2">
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-full" />
                <Skeleton className="w-20 h-5 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-16 h-3" />
                <Skeleton className="w-24 h-3 ml-auto" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
