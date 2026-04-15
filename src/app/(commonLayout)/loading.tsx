export default function CommonLayoutLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-background animate-pulse">
      {/* Navbar skeleton */}
      <div className="border-b border-border/50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-32 h-7 bg-muted rounded-lg" />
            <div className="hidden lg:flex items-center gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-16 h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded-lg" />
            <div className="w-20 h-8 bg-muted rounded-lg" />
            <div className="w-20 h-8 bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      {/* Page content skeleton */}
      <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
        {/* Hero/header area */}
        <div className="space-y-3">
          <div className="w-48 h-8 bg-muted rounded-lg" />
          <div className="w-72 h-4 bg-muted rounded" />
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="aspect-2/3 w-full bg-muted rounded-2xl" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}