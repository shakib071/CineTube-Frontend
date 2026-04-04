"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Film, Crown, Clock } from "lucide-react";
import { IMedia } from "@/types/media.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PLATFORM_LABELS: Record<string, string> = {
  NETFLIX: "Netflix",
  DISNEY_PLUS: "Disney+",
  YOUTUBE: "YouTube",
  AMAZON_PRIME: "Prime",
  HBO: "HBO",
  OTHER: "Other",
};

interface MediaCardProps {
  media: IMedia;
  rank?: number;
}

export default function MediaCard({ media, rank }: MediaCardProps) {
  return (
    <Link
      href={`/media-details/${media.id}`}
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden border border-border/50",
        "bg-card hover:border-red-500/40 transition-all duration-300",
        "hover:shadow-[0_8px_32px_rgba(239,68,68,0.12)] hover:-translate-y-1"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {media.thumbnailUrl ? (
          <Image
            src={media.thumbnailUrl}
            alt={media.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Film className="w-10 h-10" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Rank badge */}
        {rank && (
          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">#{rank}</span>
          </div>
        )}

        {/* Premium badge */}
        {media.pricingType === "PREMIUM" && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <Crown className="w-2.5 h-2.5" />
            PRO
          </div>
        )}

        {/* Rating overlay */}
        {media.averageRating && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {media.averageRating.toFixed(1)}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-red-500 transition-colors">
          {media.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {media.releaseYear && <span>{media.releaseYear}</span>}
          {media.releaseYear && media.director && <span>·</span>}
          {media.director && (
            <span className="truncate max-w-[100px]">{media.director}</span>
          )}
        </div>

        {/* Genres */}
        {media.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {media.genre.slice(0, 2).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 rounded-sm font-normal"
              >
                {g}
              </Badge>
            ))}
            {media.genre.length > 2 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 rounded-sm font-normal"
              >
                +{media.genre.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-border/40">
          <span className="text-[10px] text-muted-foreground font-medium">
            {PLATFORM_LABELS[media.platform] ?? media.platform}
          </span>
          {media.totalReviews > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              {media.totalReviews} {media.totalReviews === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
