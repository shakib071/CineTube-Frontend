"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Crown, Loader2, ShoppingCart, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createStripeSubscriptionAction } from "@/app/(commonLayout)/subscription/_action";
import { createPurchaseAction } from "@/app/(commonLayout)/subscription/_action";
import { IMedia } from "@/types/media.types";

interface Props {
  media: IMedia;
  hasAccess: boolean;
  isLoggedIn: boolean;
}

export default function StreamButton({ media, hasAccess, isLoggedIn }: Props) {
  const router = useRouter();
  const [showPaywall, setShowPaywall] = useState(false);
  const [loading, setLoading] = useState<"subscribe" | "buy" | "rent" | null>(null);

  // Free media — just redirect to videoUrl
  if (media.pricingType === "FREE") {
    if (!media.videoUrl) return null;
    return (
      <Button
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => window.open(media.videoUrl, "_blank")}
      >
        <Play className="w-4 h-4 fill-current" /> Watch Now
      </Button>
    );
  }

  // Premium + has access — go straight to video
  if (hasAccess) {
    if (!media.videoUrl) return null;
    return (
      <Button
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => window.open(media.videoUrl, "_blank")}
      >
        <Play className="w-4 h-4 fill-current" /> Watch Now
      </Button>
    );
  }

  // Premium + no access — show button that opens paywall
  const handleSubscribe = async () => {
    if (!isLoggedIn) { router.push("/login"); return; }
    // setLoading("subscribe");
    // const res = await createStripeSubscriptionAction("MONTHLY");
    router.push('/subscription');
    // setLoading(null);
    // if (!res.success) { toast.error(res.message); return; }
    // router.push(res.url);
  };

  const handleBuy = async () => {
    if (!isLoggedIn) { router.push("/login"); return; }
    setLoading("buy");
    const res = await createPurchaseAction(media.id, "BUY");
    setLoading(null);
    if (!res.success) { toast.error(res.message); return; }
    router.push(res.url);
  };

  const handleRent = async () => {
    if (!isLoggedIn) { router.push("/login"); return; }
    setLoading("rent");
    const res = await createPurchaseAction(media.id, "RENT");
    setLoading(null);
    if (!res.success) { toast.error(res.message); return; }
    router.push(res.url);
  };

  return (
    <>
      {/* Stream button */}
      <Button
        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => {
          if (!isLoggedIn) { router.push("/login"); return; }
          setShowPaywall(true);
        }}
      >
        <Play className="w-4 h-4 fill-current" /> Watch Now
      </Button>

      {/* Paywall overlay */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
            onClick={() => setShowPaywall(false)}
          />

          {/* Modal card */}
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border/60 bg-card shadow-2xl p-6 space-y-5">
            {/* Close */}
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm leading-tight">Premium content</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{media.title}</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Choose how you want to access this title:
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {/* Subscribe */}
              <button
                onClick={handleSubscribe}
                disabled={!!loading}
                className="w-full flex items-center gap-3 rounded-xl border border-border/50 bg-background hover:border-red-500/40 hover:bg-red-500/5 p-3.5 text-left transition-colors disabled:opacity-60 group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 transition-colors">
                  {loading === "subscribe" ? (
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                  ) : (
                    <Crown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">Subscribe</p>
                  <p className="text-xs text-muted-foreground">$9.99/month · Unlimited access</p>
                </div>
              </button>

              {/* Buy */}
              {media.price && (
                <button
                  onClick={handleBuy}
                  disabled={!!loading}
                  className="w-full flex items-center gap-3 rounded-xl border border-border/50 bg-background hover:border-blue-500/40 hover:bg-blue-500/5 p-3.5 text-left transition-colors disabled:opacity-60 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    {loading === "buy" ? (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : (
                      <ShoppingCart className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Buy</p>
                    <p className="text-xs text-muted-foreground">${media.price.toFixed(2)} · Own forever</p>
                  </div>
                </button>
              )}

              {/* Rent */}
              {media.price && (
                <button
                  onClick={handleRent}
                  disabled={!!loading}
                  className="w-full flex items-center gap-3 rounded-xl border border-border/50 bg-background hover:border-amber-500/40 hover:bg-amber-500/5 p-3.5 text-left transition-colors disabled:opacity-60 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    {loading === "rent" ? (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">Rent</p>
                    <p className="text-xs text-muted-foreground">
                      ${(media.price * 0.4).toFixed(2)} · 48-hour access
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
