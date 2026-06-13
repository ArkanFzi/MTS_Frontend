import { Skeleton } from "../../../../components/ui/skeleton";

export function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-5 p-5 bg-[#161618] border border-[#2A2A2C] rounded-lg">
          <div className="flex flex-col items-center gap-2 min-w-[80px]">
            <Skeleton className="w-10 h-6" />
            <Skeleton className="w-8 h-3" />
            <Skeleton className="w-8 h-3" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-20 h-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
