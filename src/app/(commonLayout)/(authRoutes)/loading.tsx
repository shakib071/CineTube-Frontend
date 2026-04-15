export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background animate-pulse">
      <div className="w-full max-w-md space-y-6">
        {/* Logo skeleton */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-muted rounded-xl" />
          <div className="w-32 h-7 bg-muted rounded-lg" />
        </div>

        {/* Card skeleton */}
        <div className="bg-muted/30 border border-border/50 rounded-2xl p-8 space-y-5">
          {/* Title */}
          <div className="space-y-2 text-center">
            <div className="w-40 h-7 bg-muted rounded-lg mx-auto" />
            <div className="w-56 h-4 bg-muted rounded mx-auto" />
          </div>

          {/* Fields */}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-16 h-4 bg-muted rounded" />
              <div className="w-full h-11 bg-muted rounded-lg" />
            </div>
          ))}

          {/* Button */}
          <div className="w-full h-11 bg-muted rounded-lg" />

          {/* Divider */}
          <div className="w-full h-px bg-muted" />

          {/* Social button */}
          <div className="w-full h-11 bg-muted rounded-lg" />
        </div>

        {/* Footer link */}
        <div className="w-32 h-4 bg-muted rounded mx-auto" />
      </div>
    </div>
  );
}
