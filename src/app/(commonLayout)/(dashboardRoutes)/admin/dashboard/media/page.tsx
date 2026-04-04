"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Film,
  Loader2,
  Eye,
  EyeOff,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAllMediaAction, deleteMediaAction } from "./_action";
import { IMedia } from "@/types/media.types";

import Image from "next/image";
import MediaForm from "@/components/modules/admin/MediaForm";

export default function AdminMediaPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [pricingFilter, setPricingFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editMedia, setEditMedia] = useState<IMedia | null>(null);
  const [deleteMedia, setDeleteMedia] = useState<IMedia | null>(null);

  // build query params
  const params: Record<string, string> = {
    page: String(page),
    limit: "10",
  };
  if (search) params.searchTerm = search;
  if (typeFilter !== "ALL") params.type = typeFilter;
  if (pricingFilter !== "ALL") params.pricingType = pricingFilter;

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media", params],
    queryFn: () => getAllMediaAction(params),
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteMediaAction(id),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("Media deleted successfully");
      setDeleteMedia(null);
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: () => toast.error("Failed to delete media"),
  });

  const mediaList: IMedia[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage movies and series
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Media
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, director..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 h-10"
          />
        </div>
        <Select
          value={typeFilter}
          onValueChange={(v) => { setTypeFilter(v); setPage(1); }}
        >
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="MOVIE">Movie</SelectItem>
            <SelectItem value="SERIES">Series</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={pricingFilter}
          onValueChange={(v) => { setPricingFilter(v); setPage(1); }}
        >
          <SelectTrigger className="w-36 h-10">
            <SelectValue placeholder="Pricing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Pricing</SelectItem>
            <SelectItem value="FREE">Free</SelectItem>
            <SelectItem value="PREMIUM">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Media
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Pricing
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Rating
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : mediaList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <Film className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No media found
                    </p>
                  </td>
                </tr>
              ) : (
                mediaList.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {/* Media info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.title}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Film className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-48">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.director || "—"} · {item.releaseYear || "—"}
                          </p>
                          {item.isFeatured && (
                            <Badge className="mt-1 text-[10px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-600 border-amber-500/20">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </td>

                    {/* Pricing */}
                    <td className="px-4 py-3">
                      {item.pricingType === "PREMIUM" ? (
                        <Badge className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/20">
                          ${item.price} Premium
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                          Free
                        </Badge>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-sm text-foreground">
                          {item.averageRating?.toFixed(1) || "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({item.totalReviews})
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {item.isPublished ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Published</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <EyeOff className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Draft</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditMedia(item)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteMedia(item)}
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
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, meta.total)} of{" "}
            {meta.total} items
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-foreground">
              {page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Media</DialogTitle>
          </DialogHeader>
          <MediaForm onSuccess={() => {
            setCreateOpen(false);
            queryClient.invalidateQueries({ queryKey: ["admin-media"] });
          }} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={!!editMedia} onOpenChange={() => setEditMedia(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
          </DialogHeader>
          {editMedia && (
            <MediaForm
              media={editMedia}
              onSuccess={() => {
                setEditMedia(null);
                queryClient.invalidateQueries({ queryKey: ["admin-media"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteMedia} onOpenChange={() => setDeleteMedia(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteMedia?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMedia && handleDelete(deleteMedia.id)}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
