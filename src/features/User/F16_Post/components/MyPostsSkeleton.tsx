// src/features/User/F16_Post/components/MyPostsSkeleton.tsx
import { Skeleton } from '../../../../components/ui/skeleton';

export default function MyPostsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#161618] border border-[#2A2A2C] rounded-lg p-5 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="w-16 h-4 rounded-full" />
            <Skeleton className="w-12 h-4 rounded-full" />
          </div>
          <Skeleton className="w-3/4 h-5" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-4 rounded-full" />
            <Skeleton className="w-16 h-4 rounded-full" />
          </div>
          <Skeleton className="w-1/2 h-3" />
        </div>
      ))}
    </div>
  );
}
