// src/features/Admin/F11_BadgeMaster/components/BadgeTableSkeleton.tsx
import { Skeleton } from '../../../../components/ui/skeleton';

export default function BadgeTableSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 p-4 bg-[#0B0B0C]/50 rounded-lg">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-10 h-10" />
          <Skeleton className="flex-1 h-4" />
          <Skeleton className="w-16 h-5" />
        </div>
      ))}
    </div>
  );
}
