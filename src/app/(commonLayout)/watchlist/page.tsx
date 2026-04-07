import Link from "next/link";
import Image from "next/image";
import { Film, Star, Bookmark, ArrowRight, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getWatchlistAction } from "./_action";
import { getUserInfo } from "@/services/auth.service";
import { redirect } from "next/navigation";
import WatchlistRemoveButton from "@/components/modules/watchlist/WatchlistRemoveButton";
import { IWatchlistItem, } from "@/types/wathlist.types";


export const metadata = {
  title: "My Watchlist — CineTube",
};

const PLATFORM_LABELS: Record<string, string> = {
  NETFLIX: "Netflix", DISNEY_PLUS: "Disney+", YOUTUBE: "YouTube",
  AMAZON_PRIME: "Prime", HBO: "HBO", OTHER: "Other",
};

export default async function WatchlistPage() {
  const user = await getUserInfo();
  if (!user) redirect("/login");

  const res = await getWatchlistAction();
  const items = res.success ? (res.data ?? []) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Bookmark className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground">My Watchlist</h1>
            <Badge variant="secondary" className="text-xs">{items.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Titles you&apos;ve saved to watch later
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Bookmark className="w-8 h-8" />
            </div>
            <p className="text-xl font-semibold text-foreground">Your watchlist is empty</p>
            <p className="text-sm text-center max-w-sm">
              Browse movies and series and click the Watchlist button to save them here.
            </p>
            <Link
              href="/all-media"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Browse all media <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item: IWatchlistItem) => {
              const media = item.media;
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-red-500/40 hover:shadow-[0_8px_32px_rgba(239,68,68,0.10)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <Link href={`/media-details/${media.id}`}>
                    <div className="relative aspect-2/3 w-full overflow-hidden bg-muted">
                      {media.thumbnailUrl ? (
                        <Image
                          src={media.thumbnailUrl}
                          alt={media.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}

                      {/* Premium badge */}
                      {media.pricingType === "PREMIUM" && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <Crown className="w-2.5 h-2.5" /> PRO
                        </div>
                      )}

                      {/* Rating */}
                      {media.averageRating && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {media.averageRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-3 flex flex-col gap-1.5 flex-1">
                    <Link href={`/media-details/${media.id}`}>
                      <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-red-500 transition-colors">
                        {media.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                        {media.type === "MOVIE" ? "Movie" : "Series"}
                      </Badge>
                      {media.releaseYear && <span>{media.releaseYear}</span>}
                      {media.platform && (
                        <span>{PLATFORM_LABELS[media.platform] ?? media.platform}</span>
                      )}
                    </div>

                    {media.genre?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {media.genre.slice(0, 2).map((g: string) => (
                          <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded-sm">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Remove button */}
                    <div className="mt-auto pt-2">
                      <WatchlistRemoveButton mediaId={media.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
