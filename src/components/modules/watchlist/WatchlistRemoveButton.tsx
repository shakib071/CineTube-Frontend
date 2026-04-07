"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { removeFromWatchlistAction } from "@/app/(commonLayout)/watchlist/_action";


export default function WatchlistRemoveButton({ mediaId }: { mediaId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    setLoading(true);
    const res = await removeFromWatchlistAction(mediaId);
    setLoading(false);
    if (!res.success) {
      toast.error(res.message ?? "Failed to remove");
      return;
    }
    toast.success("Removed from watchlist");
    router.refresh();
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-destructive border border-border/50 hover:border-destructive/40 rounded-lg py-1.5 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      Remove
    </button>
  );
}
