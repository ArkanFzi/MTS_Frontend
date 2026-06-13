// src/features/User/F27_GamificationLeaderboard/components/LeaderboardSkeleton.tsx
import { Skeleton } from '../../../../components/ui/skeleton';

export default function LeaderboardSkeleton() {
  return (
    <div className="border border-[#2A2A2C] rounded-xl overflow-hidden bg-[#161618]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#2A2A2C]">
          <Skeleton className="w-12 h-6" />
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="w-32 h-4" />
          </div>
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-24 h-6 rounded-full" />
        </div>
      ))}
    </div>
  );
}
