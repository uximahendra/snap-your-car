export const SessionDetailHeaderSkeleton = () => (
  <header className="bg-card border-b border-border p-5 sticky top-0 z-10 shadow-[var(--elevation-2)]">
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="h-11 w-11 rounded-xl skeleton" />
        <div className="flex gap-2">
          <div className="h-11 w-28 rounded-xl skeleton" />
          <div className="h-11 w-11 rounded-xl skeleton" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-7 w-48 skeleton" />
        <div className="h-4 w-56 skeleton" />
      </div>
    </div>
  </header>
);

export const SessionDetailImageCardSkeleton = () => (
  <div className="space-y-3">
    <div className="aspect-square rounded-2xl skeleton" />
    <div className="text-center px-2 space-y-1">
      <div className="h-4 w-24 skeleton mx-auto" />
      <div className="h-3 w-16 skeleton mx-auto" />
    </div>
  </div>
);

export const SessionDetailPageSkeleton = () => (
  <div className="min-h-screen bg-background pb-6">
    <SessionDetailHeaderSkeleton />
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 gap-4">
        {[...Array(8)].map((_, i) => (
          <SessionDetailImageCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
