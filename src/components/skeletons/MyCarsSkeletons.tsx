export const MyCarsHeaderSkeleton = () => (
  <header className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10 shadow-[var(--elevation-2)]">
    <div className="max-w-md mx-auto flex items-center justify-between">
      <div className="h-8 w-24 skeleton" />
      <div className="h-11 w-11 rounded-xl skeleton" />
    </div>
  </header>
);

export const MyCarsSearchSkeleton = () => (
  <div className="relative">
    <div className="h-12 w-full rounded-xl skeleton" />
  </div>
);

export const MyCarsSessionCardSkeleton = () => (
  <div className="bg-card rounded-2xl p-5 shadow-[var(--elevation-2)] border border-border">
    <div className="flex gap-4">
      <div className="w-20 h-20 rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-3">
        <div className="space-y-2">
          <div className="h-5 w-32 skeleton" />
          <div className="h-4 w-40 skeleton" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 flex-1 rounded-xl skeleton" />
          <div className="h-9 flex-1 rounded-xl skeleton" />
        </div>
      </div>
    </div>
  </div>
);

export const MyCarsListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <MyCarsSessionCardSkeleton key={i} />
    ))}
  </div>
);

export const MyCarsPageSkeleton = () => (
  <div className="min-h-screen bg-background pb-24">
    <MyCarsHeaderSkeleton />
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Welcome Text Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-32 skeleton" />
        <div className="h-4 w-48 skeleton" />
      </div>
      
      <MyCarsSearchSkeleton />
      <MyCarsListSkeleton />
    </div>
  </div>
);
