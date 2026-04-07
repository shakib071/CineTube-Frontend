"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addToWatchlistAction, removeFromWatchlistAction } from "@/app/(commonLayout)/watchlist/_action";

interface Props {
  mediaId: string;
  initialInWatchlist: boolean;
  isLoggedIn: boolean;
}

export default function WatchlistButton({ mediaId, initialInWatchlist, isLoggedIn }: Props) {
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to use your watchlist");
      return;
    }

    setLoading(true);
    if (inWatchlist) {
      const res = await removeFromWatchlistAction(mediaId);
      if (res.success) {
        setInWatchlist(false);
        toast.success("Removed from watchlist");
      } else {
        toast.error(res.message ?? "Failed to remove");
      }
    } else {
      const res = await addToWatchlistAction(mediaId);
      if (res.success) {
        setInWatchlist(true);
        toast.success("Added to watchlist");
      } else {
        toast.error(res.message ?? "Failed to add");
      }
    }
    setLoading(false);
  };

  return (
    <Button
      variant={inWatchlist ? "default" : "outline"}
      className={`gap-2 transition-all ${inWatchlist ? "bg-red-600 hover:bg-red-700 text-white border-red-600" : ""}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : inWatchlist ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
      {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  );
}
