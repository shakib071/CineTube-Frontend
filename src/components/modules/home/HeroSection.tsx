import Image from "next/image";
import Link from "next/link";
import { Star, Play, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHeroMediaAction } from "@/app/(commonLayout)/_action";


export default async function HeroSection() {
  const media = await getHeroMediaAction();

  // ── Fallback hero when no featured media exists ──────────────────────────
  if (!media) {
    return (
      <div className="relative min-h-120 flex items-center justify-center bg-muted/40">
        <div className="text-center space-y-5 px-4">
          <h1 className="text-4xl lg:text-6xl font-black text-foreground tracking-tight">
            Your Streaming Universe
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Discover, rate, and stream the best movies and series — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild className="gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
              <Link href="/all-media">
                <Play className="w-4 h-4 fill-current" /> Browse all
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-6">
              <Link href="/subscription">
                <Crown className="w-4 h-4" /> Go premium
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Full hero ─────────────────────────────────────────────────────────────
  return (
    <div className="relative h-[70vh] min-h-125 overflow-hidden">
      {media.thumbnailUrl && (
        <>
          <Image
            src={media.thumbnailUrl}
            alt=""
            fill
            className="object-cover scale-105"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/75 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        </>
      )}

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-xl space-y-4 py-12">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-red-600 text-white text-xs font-semibold px-3">
              Featured
            </Badge>
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              {media.type === "MOVIE" ? "Movie" : "Series"}
            </Badge>
            {media.pricingType === "FREE" && (
              <Badge className="text-xs bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                Free to watch
              </Badge>
            )}
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight">
            {media.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {media.averageRating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-foreground">
                  {media.averageRating.toFixed(1)}
                </span>
                <span>/10</span>
              </div>
            )}
            {media.releaseYear && <span>{media.releaseYear}</span>}
            {media.director && <span>Dir. {media.director}</span>}
          </div>

          {media.synopsis && (
            <p className="text-muted-foreground leading-relaxed text-[15px] line-clamp-3">
              {media.synopsis}
            </p>
          )}

          {media.genre.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {media.genre.slice(0, 3).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild className="gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
              <Link href={`/media-details/${media.id}`}>
                <Play className="w-4 h-4 fill-current" /> Watch now
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-6">
              <Link href="/all-media">Browse all</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
