"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, Film } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import MediaCard from "./MediaCard";

import { IMedia } from "@/types/media.types";
import { getMediaAction, MediaQueryParams } from "@/app/(commonLayout)/movies/_action";

const GENRES = [
  "Action", "Drama", "Comedy", "Thriller", "Sci-Fi",
  "Horror", "Romance", "Adventure", "Animation", "Documentary",
  "Crime", "Fantasy", "Mystery", "Biography",
];

const PLATFORMS = [
  { value: "NETFLIX", label: "Netflix" },
  { value: "DISNEY_PLUS", label: "Disney+" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "AMAZON_PRIME", label: "Amazon Prime" },
  { value: "HBO", label: "HBO" },
  { value: "OTHER", label: "Other" },
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest first" },
  { value: "createdAt_asc", label: "Oldest first" },
  { value: "averageRating_desc", label: "Top rated" },
  { value: "totalReviews_desc", label: "Most reviewed" },
  { value: "title_asc", label: "A – Z" },
  { value: "title_desc", label: "Z – A" },
];

interface Props {
  type?: "MOVIE" | "SERIES";
  defaultSort?: string;
  showRank?: boolean;
  title: string;
  subtitle?: string;
  defaultGenre?: string;
  
}

export default function MediaGrid({ type, defaultSort = "createdAt_desc", showRank, title, subtitle, defaultGenre }: Props) {
  const [isPending, startTransition] = useTransition();
  const [media, setMedia] = useState<IMedia[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genre, setGenre] = useState(defaultGenre ?? "ALL");
  const [platform, setPlatform] = useState("ALL");
  const [pricing, setPricing] = useState("ALL");
  const [sort, setSort] = useState(defaultSort);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => { 
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1); 

  }, [debouncedSearch, genre, platform, pricing, sort]);

  const fetchMedia = useCallback(() => {
    const [sortBy, sortOrder] = sort.split("_") as [string, "asc" | "desc"];
    const params: MediaQueryParams = {
      page,
      limit: 18,
      sortBy,
      sortOrder,
    };
    if (type) params.type = type;
    if (debouncedSearch) params.searchTerm = debouncedSearch;
    if (genre !== "ALL") params.genre = genre;
    if (platform !== "ALL") params.platform = platform;
    if (pricing !== "ALL") params.pricingType = pricing;

    startTransition(async () => {
      const res = await getMediaAction(params);
      if (res.success && res.data) {
        setMedia(res.data);
        setMeta({
          page: res.meta?.page ?? 1,
          totalPages: res.meta?.totalPages ?? 1,
          total: res.meta?.total ?? 0,
        });
      }
    });
  }, [type, page, debouncedSearch, genre, platform, pricing, sort]);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const activeFilters = [
    genre !== "ALL" && genre,
    platform !== "ALL" && PLATFORMS.find(p => p.value === platform)?.label,
    pricing !== "ALL" && pricing,
  ].filter(Boolean) as string[];

  const clearFilter = (label: string) => {
    const p = PLATFORMS.find(p => p.label === label);
    if (p) { setPlatform("ALL"); return; }
    if (label === "FREE" || label === "PREMIUM") { setPricing("ALL"); return; }
    setGenre("ALL");
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search title, director..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-9 w-36 text-sm hidden sm:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filter trigger */}
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 relative">
                    <SlidersHorizontal className="w-4 h-4" />
                    {activeFilters.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                        {activeFilters.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader className="mb-5">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <>
                    <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Genre</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["ALL", ...GENRES].map((g) => (
                          <button
                            key={g}
                            onClick={() => setGenre(g)}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                              genre === g
                                ? "bg-red-600 text-white border-red-600"
                                : "border-border text-muted-foreground hover:border-red-500/50 hover:text-foreground"
                            }`}
                          >
                            {g === "ALL" ? "All Genres" : g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Platform</p>
                      <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All platforms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All platforms</SelectItem>
                          {PLATFORMS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pricing</p>
                      <div className="flex gap-2">
                        {["ALL", "FREE", "PREMIUM"].map((p) => (
                          <button
                            key={p}
                            onClick={() => setPricing(p)}
                            className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                              pricing === p
                                ? "bg-red-600 text-white border-red-600"
                                : "border-border text-muted-foreground hover:border-red-500/50"
                            }`}
                          >
                            {p === "ALL" ? "All" : p === "FREE" ? "Free" : "Premium"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setGenre("ALL"); setPlatform("ALL"); setPricing("ALL"); }}
                      className="w-full"
                    >
                      Clear filters
                    </Button>
                  </div>
                  </>
                  {/* Sort in mobile sheet */}
                  <div className="mt-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Sort by</p>
                    <Select value={sort} onValueChange={setSort}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Filters:</span>
              {activeFilters.map((f) => (
                <Badge
                  key={f}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                  onClick={() => clearFilter(f)}
                >
                  {f}
                  <X className="w-2.5 h-2.5" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-muted-foreground">
            {isPending ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <>
                <span className="font-semibold text-foreground">{meta.total}</span> results
                {debouncedSearch && <> for <span className="font-semibold text-foreground">&quot;{debouncedSearch}&quot;</span></>}
              </>
            )}
          </p>
        </div>

        {/* Grid */}
        {isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-2/3" />
            ))}
          </div>
        ) : media.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-muted-foreground">
            <Film className="w-14 h-14" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setGenre("ALL");
                setPlatform("ALL");
                setPricing("ALL");
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {media.map((item, i) => (
              <MediaCard
                key={item.id}
                media={item}
                rank={showRank ? (page - 1) * 18 + i + 1 : undefined}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && !isPending && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(meta.totalPages, 7) }, (_, i) => {
                const pg = meta.totalPages <= 7
                  ? i + 1
                  : page <= 4
                    ? i + 1
                    : page >= meta.totalPages - 3
                      ? meta.totalPages - 6 + i
                      : page - 3 + i;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                      pg === page
                        ? "bg-red-600 text-white font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
