

import { MediaType, PricingType, Platform } from "./media.types";

export interface IWatchlistMedia {
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  synopsis?: string | null;
  type: MediaType;
  pricingType: PricingType;
  platform: Platform;
  averageRating?: number | null;
  totalReviews: number;
  genre: string[];
  releaseYear?: number | null;
  director?: string | null;
}

export interface IWatchlistItem {
  id: string;
  userId: string;
  mediaId: string;
  createdAt: string;
  media: IWatchlistMedia;
}

export interface IWatchlistStatus {
  isInWatchlist: boolean;
}