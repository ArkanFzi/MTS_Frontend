import { Skeleton } from "../ui/skeleton";

export default function PostListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex gap-4 p-5 bg-[#161618] border border-[#2A2A2C] rounded-lg"
        >
          <div className="flex flex-col items-center gap-2 min-w-[70px]">
            <Skeleton className="w-8 h-6" />
            <Skeleton className="w-16 h-12" />
            <Skeleton className="w-16 h-12" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="w-3/4 h-5" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
            <div className="flex gap-2">
              <Skeleton className="w-16 h-5 rounded-full" />
              <Skeleton className="w-16 h-5 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
