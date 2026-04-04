export type MediaType = "MOVIE" | "SERIES";
export type PricingType = "FREE" | "PREMIUM";
export type Platform =
  | "NETFLIX"
  | "DISNEY_PLUS"
  | "YOUTUBE"
  | "AMAZON_PRIME"
  | "HBO"
  | "OTHER";

export interface IMedia {
  id: string;
  title: string;
  synopsis?: string;
  genre: string[];
  releaseYear?: number;
  releaseMonth?: number;
  director?: string;
  cast: string[];
  platform: Platform;
  videoUrl?: string;
  thumbnailUrl?: string;
  trailerUrl?: string;
  type: MediaType;
  pricingType: PricingType;
  price?: number;
  isPublished: boolean;
  isFeatured: boolean;
  averageRating?: number;
  totalReviews: number;
  createdAt: string;
}

export interface IMediaListResponse {
  data: IMedia[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
