export default function DashboardLoading() {
  return (
    <div className="flex h-screen bg-background animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r border-border flex flex-col p-4 gap-3 shrink-0">
        <div className="w-32 h-6 bg-muted rounded-lg mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-2 py-2">
            <div className="w-5 h-5 bg-muted rounded" />
            <div className="w-24 h-4 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Page header */}
        <div className="space-y-2">
          <div className="w-48 h-8 bg-muted rounded-lg" />
          <div className="w-64 h-4 bg-muted rounded" />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-24 h-4 bg-muted rounded" />
                <div className="w-8 h-8 bg-muted rounded-lg" />
              </div>
              <div className="w-20 h-7 bg-muted rounded-lg" />
              <div className="w-32 h-3 bg-muted rounded" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Table header */}
          <div className="bg-muted/50 px-4 py-3 flex gap-4 border-b border-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-24 h-4 bg-muted rounded" />
            ))}
          </div>
          {/* Table rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4 border-b border-border/50 last:border-0">
              <div className="w-10 h-10 bg-muted rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="w-32 h-4 bg-muted rounded" />
                <div className="w-48 h-3 bg-muted rounded" />
              </div>
              <div className="w-16 h-6 bg-muted rounded-full" />
              <div className="w-16 h-6 bg-muted rounded-full" />
              <div className="w-20 h-3 bg-muted rounded ml-auto" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
