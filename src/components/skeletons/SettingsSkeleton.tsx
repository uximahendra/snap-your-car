export const SettingsHeaderSkeleton = () => (
  <header className="bg-card border-b border-border p-5 sticky top-0 z-10 shadow-[var(--elevation-2)]">
    <div className="max-w-md mx-auto flex items-center justify-between">
      <div className="h-11 w-11 rounded-xl skeleton" />
      <div className="h-6 w-24 skeleton" />
      <div className="w-11" />
    </div>
  </header>
);

export const SettingsProfileSkeleton = () => (
  <div className="bg-card rounded-2xl p-6 text-center shadow-[var(--elevation-2)] border border-border">
    <div className="h-12 w-12 rounded-xl skeleton mx-auto" />
    <div className="h-6 w-32 skeleton mx-auto mt-5" />
    <div className="h-4 w-48 skeleton mx-auto mt-2" />
    <div className="h-11 w-32 rounded-xl skeleton mx-auto mt-4" />
  </div>
);

export const SettingsSectionSkeleton = () => (
  <div className="space-y-3">
    <div className="h-6 w-28 skeleton" />
    <div className="bg-card rounded-2xl p-5 space-y-5 shadow-[var(--elevation-2)] border border-border">
      <div className="space-y-2.5">
        <div className="h-4 w-36 skeleton" />
        <div className="h-11 w-full rounded-xl skeleton" />
      </div>
      <div className="flex items-center justify-between py-1">
        <div className="h-4 w-40 skeleton" />
        <div className="h-6 w-11 rounded-full skeleton" />
      </div>
      <div className="flex items-center justify-between py-1">
        <div className="h-4 w-24 skeleton" />
        <div className="h-6 w-11 rounded-full skeleton" />
      </div>
    </div>
  </div>
);

export const SettingsPageSkeleton = () => (
  <div className="min-h-screen bg-background pb-6">
    <SettingsHeaderSkeleton />
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <SettingsProfileSkeleton />
      <SettingsSectionSkeleton />
      
      {/* Support Section Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-20 skeleton" />
        <div className="bg-card rounded-2xl p-2 space-y-1 shadow-[var(--elevation-2)] border border-border">
          <div className="h-14 w-full rounded-xl skeleton" />
          <div className="h-14 w-full rounded-xl skeleton" />
        </div>
      </div>
      
      {/* Account Section Skeleton */}
      <div className="space-y-3">
        <div className="bg-card rounded-2xl p-2 shadow-[var(--elevation-2)] border border-border">
          <div className="h-14 w-full rounded-xl skeleton" />
        </div>
      </div>
    </div>
  </div>
);
