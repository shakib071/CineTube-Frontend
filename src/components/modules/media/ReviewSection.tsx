"use client";

import { useState, useTransition } from "react";
import {
  Star,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Trash2,
  AlertTriangle,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IReview, IComment, IReviewMeta } from "@/types/review.types";
import { IUser } from "@/types/user.types";
import { addCommentAction, createReviewAction, deleteCommentAction, getReviewsByMediaAction, toggleLikeAction } from "@/app/(commonLayout)/media-details/[id]/_action";

const PRESET_TAGS = ["Classic", "Underrated", "Masterpiece", "Overrated", "Family-friendly", "Must-watch"];

interface Props {
  mediaId: string;
  initialReviews: IReview[];
  initialMeta: IReviewMeta;
  currentUser: IUser | null;
}

export default function ReviewSection({
  mediaId,
  initialReviews,
  initialMeta,
  currentUser,
}: Props) {
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);
  const [meta, setMeta] = useState<IReviewMeta>(initialMeta);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Write review form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [hasSpoiler, setHasSpoiler] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Like state — track locally for instant UI
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(
    Object.fromEntries(initialReviews.map((r) => [r.id, r.likes?.length ?? 0]))
  );

  const fetchPage = (p: number) => {
    startTransition(async () => {
      const res = await getReviewsByMediaAction(mediaId, p, 5);
      if (res.success && res.data) {
        setReviews(res.data);
        setMeta(res.meta);
        setPage(p);
      }
    });
  };

  const handleSubmitReview = async () => {
    if (!currentUser) { toast.error("Please login to write a review"); return; }
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (content.trim().length < 10) { toast.error("Review must be at least 10 characters"); return; }

    setSubmitting(true);
    const res = await createReviewAction({ mediaId, rating, review_content: content.trim(), hasSpoiler, tags });
    setSubmitting(false);

    if (!res.success) { toast.error(res.message); return; }
    toast.success("Review submitted — pending admin approval");
    setShowForm(false);
    setRating(0); setContent(""); setHasSpoiler(false); setTags([]);
    fetchPage(1);
  };

  const handleLike = async (reviewId: string) => {
    if (!currentUser) { toast.error("Please login to like reviews"); return; }
    const wasLiked = likedReviews.has(reviewId);
    setLikedReviews((prev) => {
      const next = new Set(prev);
      wasLiked ? next.delete(reviewId) : next.add(reviewId);
      return next;
    });
    setLikeCounts((prev) => ({ ...prev, [reviewId]: (prev[reviewId] ?? 0) + (wasLiked ? -1 : 1) }));
    const res = await toggleLikeAction(reviewId);
    if (!res.success) {
      // revert
      setLikedReviews((prev) => { const next = new Set(prev); wasLiked ? next.add(reviewId) : next.delete(reviewId); return next; });
      setLikeCounts((prev) => ({ ...prev, [reviewId]: (prev[reviewId] ?? 0) + (wasLiked ? 1 : -1) }));
    }
  };

  const toggleTag = (tag: string) =>
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Reviews
          <Badge variant="secondary" className="text-xs">{meta.total}</Badge>
        </h2>
        {currentUser && !showForm && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)} className="gap-1.5">
            <Star className="w-3.5 h-3.5" /> Write a Review
          </Button>
        )}
      </div>

      {/* Write review form */}
      {showForm && (
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <p className="font-medium text-foreground text-sm">Your Review</p>

          {/* Star rating */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Rating (1–10)</p>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      n <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-amber-500">{rating}/10</span>
              )}
            </div>
          </div>

          {/* Review text */}
          <Textarea
            placeholder="Share your thoughts about this title..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none text-sm"
          />

          {/* Tags */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Tags (optional)</p>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    tags.includes(tag)
                      ? "bg-red-600 text-white border-red-600"
                      : "border-border text-muted-foreground hover:border-red-500/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Spoiler toggle */}
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              onClick={() => setHasSpoiler((p) => !p)}
              className={`w-10 h-5 rounded-full transition-colors relative ${hasSpoiler ? "bg-red-600" : "bg-muted"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${hasSpoiler ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Contains spoilers
            </span>
          </label>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmitReview} disabled={submitting} className="gap-1.5 bg-red-600 hover:bg-red-700 text-white">
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Submit
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {isPending ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground border border-dashed border-border rounded-2xl">
          <MessageSquare className="w-10 h-10" />
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm">Be the first to review this title</p>
          {currentUser && !showForm && (
            <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>Write a Review</Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={currentUser}
              liked={likedReviews.has(review.id)}
              likeCount={likeCounts[review.id] ?? review.likes?.length ?? 0}
              onLike={() => handleLike(review.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="icon" className="w-8 h-8" disabled={page <= 1 || isPending} onClick={() => fetchPage(page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{page} / {meta.totalPages}</span>
          <Button variant="outline" size="icon" className="w-8 h-8" disabled={page >= meta.totalPages || isPending} onClick={() => fetchPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </section>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  currentUser,
  liked,
  likeCount,
  onLike,
}: {
  review: IReview;
  currentUser: IUser | null;
  liked: boolean;
  likeCount: number;
  onLike: () => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<IComment[]>(review.comments ?? []);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleAddComment = async () => {
    if (!currentUser) { toast.error("Please login to comment"); return; }
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    const res = await addCommentAction(review.id, commentText.trim(), replyTo?.id);
    setSubmittingComment(false);
    if (!res.success) { toast.error(res.message); return; }

    if (replyTo) {
      // inject reply into parent
      setComments((prev) =>
        prev.map((c) =>
          c.id === replyTo.id
            ? { ...c, replies: [...(c.replies ?? []), res.data] }
            : c
        )
      );
    } else {
      setComments((prev) => [...prev, res.data]);
    }
    setCommentText("");
    setReplyTo(null);
  };

  const handleDeleteComment = async (commentId: string, parentId?: string | null) => {
    const res = await deleteCommentAction(commentId);
    if (!res.success) { toast.error(res.message); return; }
    if (parentId) {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: (c.replies ?? []).filter((r) => r.id !== commentId) }
            : c
        )
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
    toast.success("Comment deleted");
  };

  return (
    <div className="p-4 rounded-xl border border-border/50 bg-card space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 overflow-hidden">
            {review.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-red-500">{review.user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{review.user?.name ?? "User"}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          {review.status === "PENDING" && (
            <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>
          )}
          {review.status === "APPROVED" && (
            <Badge className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>
          )}
          {/* Rating */}
          <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600">{review.rating}/10</span>
          </div>
        </div>
      </div>

      {/* Spoiler */}
      {review.hasSpoiler && (
        <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/30 bg-amber-500/5 gap-1">
          <AlertTriangle className="w-3 h-3" /> Contains spoilers
        </Badge>
      )}

      {/* Content */}
      <p className="text-sm text-muted-foreground leading-relaxed">{review.review_content}</p>

      {/* Tags */}
      {review.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {review.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-border/40">
        <button
          onClick={onLike}
          className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"}`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-red-500" : ""}`} />
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </button>
        <button
          onClick={() => setShowComments((p) => !p)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
          {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="space-y-3 pt-1">
          {/* Comments list */}
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={(id, name) => { setReplyTo({ id, name }); }}
              onDelete={(id, parentId) => handleDeleteComment(id, parentId)}
            />
          ))}

          {/* Comment input */}
          {currentUser ? (
            <div className="flex flex-col gap-2 pt-1">
              {replyTo && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
                  Replying to <span className="font-medium text-foreground">{replyTo.name}</span>
                  <button onClick={() => setReplyTo(null)} className="ml-auto hover:text-foreground">✕</button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Add a comment..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                  className="h-8 text-xs"
                />
                <Button size="sm" className="h-8 px-3" disabled={submittingComment || !commentText.trim()} onClick={handleAddComment}>
                  {submittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Login to comment</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Comment Item (recursive for nested replies) ───────────────────────────────

function CommentItem({
  comment,
  currentUser,
  onReply,
  onDelete,
  depth = 0,
}: {
  comment: IComment;
  currentUser: IUser | null;
  onReply: (id: string, name: string) => void;
  onDelete: (id: string, parentId?: string | null) => void;
  depth?: number;
}) {
  const isOwner = currentUser?.id === comment.userId;

  return (
    <div className={`flex gap-2 ${depth > 0 ? "ml-6 pl-3 border-l border-border/40" : ""}`}>
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 text-[10px] font-semibold text-muted-foreground overflow-hidden mt-0.5">
        {comment.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={comment.user.image} alt={comment.user.name} className="w-full h-full object-cover" />
        ) : (
          comment.user?.name?.charAt(0).toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-foreground">{comment.user?.name}</span>
          <span className="text-[10px] text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{comment.content}</p>
        <div className="flex items-center gap-3 mt-1">
          {depth === 0 && (
            <button
              onClick={() => onReply(comment.id, comment.user?.name)}
              className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Reply
            </button>
          )}
          {isOwner && (
            <button
              onClick={() => onDelete(comment.id, comment.parentId)}
              className="text-[10px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-0.5"
            >
              <Trash2 className="w-2.5 h-2.5" /> Delete
            </button>
          )}
        </div>
        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUser={currentUser}
                onReply={onReply}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
