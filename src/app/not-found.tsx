'use client';
import Link from "next/link";
import { Film, Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg text-center space-y-8">

        {/* Big 404 */}
        <div className="relative">
          <p className="text-[10rem] font-black text-muted/20 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
              <Film className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back to something good.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
            <Link href="/">
              <Home className="w-4 h-4" />
              Go home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 rounded-xl px-6">
            <Link href="/all-media">
              <Search className="w-4 h-4" />
              Browse media
            </Link>
          </Button>
        </div>

        {/* Back link */}
        <button
          onClick={() => history.back()}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Go back
        </button>

      </div>
    </div>
  );
}
