"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MessageSquare, Loader2, ChevronLeft, ChevronRight,
  Check, X, Trash2, Star, AlertTriangle, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// import {
//   getAllReviewsAdminAction,
//   approveRejectReviewAction,
//   deleteReviewAdminAction,
// } from "@/app/(commonLayout)/media-details/[id]/review._action";
import { IReview } from "@/types/review.types";
import { approveRejectReviewAction, deleteReviewAdminAction, getAllReviewsAdminAction } from "@/app/(commonLayout)/media-details/[id]/_action";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [deleteReview, setDeleteReview] = useState<IReview | null>(null);

  const params: Record<string, string> = { page: String(page), limit: "10" };
  if (search) params.searchTerm = search;
  if (statusFilter !== "ALL") params.status = statusFilter;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-reviews", params],
    queryFn: () => getAllReviewsAdminAction(params),
  });

  const { mutate: handleStatusChange, isPending: isStatusPending } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      approveRejectReviewAction(id, status),
    onSuccess: (result) => {
      if (!result.success) { toast.error(result.message); return; }
      toast.success("Review updated");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("Failed to update review"),
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteReviewAdminAction(id),
    onSuccess: (result) => {
      if (!result.success) { toast.error(result.message); return; }
      toast.success("Review deleted");
      setDeleteReview(null);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const reviews: IReview[] = data?.data ?? [];
  const meta = data?.meta;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>;
      case "APPROVED": return <Badge className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>;
      case "REJECTED": return <Badge className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Review Moderation</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Approve, reject or remove user reviews</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search review content..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-36 h-10"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Review</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                </td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16">
                  <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm">No reviews found</p>
                </td></tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground overflow-hidden flex-shrink-0">
                          {review.user?.image
                            ? <img src={review.user.image} alt={review.user.name} className="w-full h-full object-cover" />
                            : review.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-xs">{review.user?.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Review content */}
                    <td className="px-4 py-3 max-w-sm">
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{review.review_content}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {review.hasSpoiler && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                            <AlertTriangle className="w-2.5 h-2.5" /> Spoiler
                          </span>
                        )}
                        {review.tags?.slice(0, 2).map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{t}</Badge>
                        ))}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-foreground">{review.rating}</span>
                        <span className="text-xs text-muted-foreground">/10</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">{getStatusBadge(review.status)}</td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {review.status !== "APPROVED" && (
                          <Button
                            variant="ghost" size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-green-600"
                            disabled={isStatusPending}
                            onClick={() => handleStatusChange({ id: review.id, status: "APPROVED" })}
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {review.status !== "REJECTED" && (
                          <Button
                            variant="ghost" size="icon"
                            className="w-8 h-8 text-muted-foreground hover:text-amber-600"
                            disabled={isStatusPending}
                            onClick={() => handleStatusChange({ id: review.id, status: "REJECTED" })}
                            title="Reject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost" size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteReview(review)}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)} of {meta.total} reviews
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="w-8 h-8" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-foreground">{page} / {meta.totalPages}</span>
            <Button variant="outline" size="icon" className="w-8 h-8" disabled={page === meta.totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deleteReview} onOpenChange={() => setDeleteReview(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this review by{" "}
              <span className="font-semibold text-foreground">{deleteReview?.user?.name}</span>?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteReview && handleDelete(deleteReview.id)}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Deleting...</> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
