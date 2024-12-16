import { Skeleton } from "@/components/ui/skeleton";

export function LoadingDashboard() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 md:h-10 w-48 md:w-64" />
          <Skeleton className="h-4 md:h-6 w-32 md:w-48 mt-2" />
        </div>
        <Skeleton className="h-8 md:h-10 w-24 md:w-32" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-24 md:h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-4">
          <Skeleton className="h-6 md:h-8 w-24 md:w-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(2).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-36 md:h-48" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 md:h-8 w-32 md:w-48" />
          <Skeleton className="h-[300px] md:h-[400px]" />
        </div>
      </div>
    </div>
  );
}