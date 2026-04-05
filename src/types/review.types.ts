export interface IReviewUser {
  id: string;
  name: string;
  image?: string | null;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  reviewId: string;
  parentId?: string | null;
  user: IReviewUser;
  replies?: IComment[];
}

export interface ILike {
  id: string;
  userId: string;
  reviewId: string;
}

export interface IReview {
  id: string;
  rating: number;
  review_content: string;
  hasSpoiler: boolean;
  tags: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  mediaId: string;
  user: IReviewUser;
  comments?: IComment[];
  likes?: ILike[];
  media?: { id: string; title: string; thumbnailUrl?: string };
}

export interface IReviewMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
