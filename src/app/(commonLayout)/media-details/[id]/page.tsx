/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Crown,
  Film,
  Calendar,
  User,
  Users,
  Tv,
  Play,
  ArrowLeft,
  MessageSquare,
  Heart,
  Clock,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaByIdAction } from "@/app/(commonLayout)/movies/_action";


const PLATFORM_LABELS: Record<string, string> = {
  NETFLIX: "Netflix",
  DISNEY_PLUS: "Disney+",
  YOUTUBE: "YouTube",
  AMAZON_PRIME: "Amazon Prime",
  HBO: "HBO",
  OTHER: "Other",
};

const PLATFORM_COLORS: Record<string, string> = {
  NETFLIX: "bg-red-600",
  DISNEY_PLUS: "bg-blue-700",
  YOUTUBE: "bg-red-500",
  AMAZON_PRIME: "bg-cyan-600",
  HBO: "bg-purple-700",
  OTHER: "bg-zinc-600",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MediaDetailPage({ params }: Props) {
  const { id } = await params;
  const res = await getMediaByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  const media = res.data;

  // Extract YouTube embed ID from videoUrl or trailerUrl
  const getYouTubeId = (url?: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
    return match?.[1] ?? null;
  };

  const trailerYtId = getYouTubeId(media.trailerUrl) ?? getYouTubeId(media.videoUrl);

  const ratingColor =
    !media.averageRating ? "text-muted-foreground"
    : media.averageRating >= 8 ? "text-emerald-500"
    : media.averageRating >= 6 ? "text-amber-500"
    : "text-red-500";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative">
        {/* Blurred backdrop */}
        {media.thumbnailUrl && (
          <div className="absolute inset-0 h-[420px] overflow-hidden">
            <Image
              src={media.thumbnailUrl}
              alt=""
              fill
              className="object-cover scale-110 blur-2xl opacity-20 dark:opacity-15 saturate-150"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
          </div>
        )}

        <div className="relative container mx-auto px-4 pt-6 pb-0">
          {/* Back button */}
          <Link
            href={media.type === "SERIES" ? "/series" : "/movies"}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {media.type === "SERIES" ? "Series" : "Movies"}
          </Link>

          {/* Main hero content */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-10">
            {/* Poster */}
            <div className="flex-shrink-0 w-40 sm:w-48 lg:w-56 mx-auto sm:mx-0">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
                {media.thumbnailUrl ? (
                  <Image
                    src={media.thumbnailUrl}
                    alt={media.title}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Film className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {media.pricingType === "PREMIUM" && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <Crown className="w-2.5 h-2.5" />
                    PREMIUM
                  </div>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 pb-6">
              {/* Type + platform badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className="text-xs uppercase tracking-wider">
                  {media.type === "MOVIE" ? "Movie" : "Series"}
                </Badge>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white ${PLATFORM_COLORS[media.platform] ?? "bg-zinc-600"}`}
                >
                  {PLATFORM_LABELS[media.platform] ?? media.platform}
                </span>
                {media.pricingType === "FREE" && (
                  <Badge className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    Free to watch
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight mb-1">
                {media.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                {media.releaseYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {media.releaseYear}
                    {media.releaseMonth && `/${String(media.releaseMonth).padStart(2, "0")}`}
                  </span>
                )}
                {media.director && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {media.director}
                  </span>
                )}
                {media.totalReviews > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {media.totalReviews} {media.totalReviews === 1 ? "review" : "reviews"}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className={`text-3xl font-black ${ratingColor}`}>
                    {media.averageRating?.toFixed(1) ?? "—"}
                  </span>
                  <span className="text-muted-foreground text-sm">/10</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-sm text-muted-foreground">
                  {media.totalReviews > 0
                    ? `Based on ${media.totalReviews} ${media.totalReviews === 1 ? "rating" : "ratings"}`
                    : "No ratings yet"}
                </div>
              </div>

              {/* Genres */}
              {media.genre.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {media.genre.map((g) => (
                    <Badge
                      key={g}
                      variant="secondary"
                      className="text-xs gap-1"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {g}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                {trailerYtId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailerYtId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="gap-2 bg-red-600 hover:bg-red-700 text-white">
                      <Play className="w-4 h-4 fill-current" />
                      Watch Trailer
                    </Button>
                  </a>
                )}
                <Button variant="outline" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            {media.synopsis && (
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">
                  {media.synopsis}
                </p>
              </section>
            )}

            {/* Trailer embed */}
            {trailerYtId && (
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3">Trailer</h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/50 bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerYtId}`}
                    title={`${media.title} trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </section>
            )}

            {/* Cast */}
            {media.cast.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Cast
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {media.cast.map((actor, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 border border-border/30"
                    >
                      <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <span className="text-sm text-foreground truncate">{actor}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews placeholder */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Reviews
                {media.totalReviews > 0 && (
                  <Badge variant="secondary" className="text-xs">{media.totalReviews}</Badge>
                )}
              </h2>

              {media.totalReviews === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground border border-dashed border-border rounded-2xl">
                  <MessageSquare className="w-10 h-10" />
                  <p className="font-medium">No reviews yet</p>
                  <p className="text-sm">Be the first to review this title</p>
                  <Button variant="outline" size="sm">Write a Review</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* @ts-expect-error reviews are included from backend */}
                  {(media.reviews ?? []).map((review: any) => (
                    <div key={review.id} className="p-4 rounded-xl border border-border/50 bg-card space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{review.user?.name ?? "User"}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review?.createdAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-semibold text-amber-600">{String(review.rating)}/10</span>
                        </div>
                      </div>

                      {review?.hasSpoiler && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/30 bg-amber-500/5">
                          ⚠ Contains spoilers
                        </Badge>
                      )}

                      <p className="text-sm text-muted-foreground leading-relaxed">{review.review_content}</p>

                      {review.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {review.tags.map((t: string) => (
                            <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-1">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors">
                          <Heart className="w-3.5 h-3.5" />
                          {review.likes?.length ?? 0} likes
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right — sidebar */}
          <aside className="space-y-6">
            {/* Details card */}
            <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
              <h3 className="font-semibold text-foreground">Details</h3>
              <div className="space-y-3 text-sm">
                <Row icon={<Tv className="w-4 h-4" />} label="Type" value={media.type === "MOVIE" ? "Movie" : "TV Series"} />
                {media.releaseYear && (
                  <Row icon={<Calendar className="w-4 h-4" />} label="Year" value={`${media.releaseYear}`} />
                )}
                {media.director && (
                  <Row icon={<User className="w-4 h-4" />} label="Director" value={media.director} />
                )}
                <Row
                  icon={<Tv className="w-4 h-4" />}
                  label="Platform"
                  value={PLATFORM_LABELS[media.platform] ?? media.platform}
                />
                <Row
                  icon={<Crown className="w-4 h-4" />}
                  label="Access"
                  value={
                    media.pricingType === "PREMIUM"
                      ? `Premium${media.price ? ` · $${media.price}` : ""}`
                      : "Free"
                  }
                />
                {media.totalReviews > 0 && (
                  <Row
                    icon={<Clock className="w-4 h-4" />}
                    label="Reviews"
                    value={`${media.totalReviews}`}
                  />
                )}
              </div>
            </div>

            {/* Rating breakdown */}
            {media.averageRating && (
              <div className="rounded-2xl border border-border/50 bg-card p-5">
                <h3 className="font-semibold text-foreground mb-4">Rating</h3>
                <div className="flex items-center justify-center flex-col gap-1">
                  <span className={`text-6xl font-black ${ratingColor}`}>
                    {media.averageRating.toFixed(1)}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-5 rounded-full transition-colors ${
                          i < Math.round(media.averageRating!)
                            ? "bg-amber-400"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {media.totalReviews} {media.totalReviews === 1 ? "rating" : "ratings"}
                  </span>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
        <span className="text-foreground font-medium truncate">{value}</span>
      </div>
    </div>
  );
}
