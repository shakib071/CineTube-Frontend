import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getUserInfo } from "@/services/auth.service";
import { IPurchase } from "@/types/payment.types";
import { Badge } from "@/components/ui/badge";
import { Receipt, Film, Clock, CheckCircle2, XCircle, Loader2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPurchaseHistoryAction } from "@/app/(commonLayout)/subscription/_action";

export const metadata = {
  title: "Purchase History — CineTube",
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const isRentalActive = (p: IPurchase) =>
  p.type === "RENT" && p.expiresAt && new Date(p.expiresAt) > new Date();

const getRentalTimeLeft = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 1) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

const StatusBadge = ({ status }: { status: IPurchase["status"] }) => {
  const map: Record<IPurchase["status"], { label: string; className: string }> = {
    SUCCESS:  { label: "Paid",    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
    PENDING:  { label: "Pending", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
    FAILED:   { label: "Failed",  className: "bg-destructive/10 text-destructive border-destructive/20" },
    REFUNDED: { label: "Refunded",className: "bg-muted text-muted-foreground border-border" },
  };
  const { label, className } = map[status];
  return (
    <Badge variant="outline" className={cn("text-[10px] font-semibold px-2", className)}>
      {label}
    </Badge>
  );
};

const TypeBadge = ({ type }: { type: IPurchase["type"] }) => {
  const map: Record<IPurchase["type"], string> = {
    BUY:          "Buy",
    RENT:         "Rent",
    SUBSCRIPTION: "Subscription",
  };
  return (
    <Badge variant="secondary" className="text-[10px] font-semibold px-2">
      {map[type]}
    </Badge>
  );
};

export default async function PurchaseHistoryPage() {
  const user = await getUserInfo();
  if (!user) redirect("/login");

  const res = await getPurchaseHistoryAction();
  const purchases: IPurchase[] = res.success ? res.data : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-bold text-foreground">Purchase History</h1>
            <Badge variant="secondary" className="text-xs">{purchases.length}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your bought titles, rentals and subscriptions
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {purchases.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Receipt className="w-8 h-8" />
            </div>
            <p className="text-xl font-semibold text-foreground">No purchases yet</p>
            <p className="text-sm text-center max-w-sm">
              Buy or rent a movie, or subscribe to a plan to see your history here.
            </p>
            <Link
              href="/subscription"
              className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              View plans
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((p) => {
              const active = isRentalActive(p);
              const canWatch =
                p.status === "SUCCESS" &&
                (p.type === "BUY" || p.type === "SUBSCRIPTION" || active);

              return (
                <div
                  key={p.id}
                  className={cn(
                    "flex gap-4 rounded-2xl border bg-card p-4 transition-colors",
                    active
                      ? "border-green-500/30"
                      : "border-border/50"
                  )}
                >
                  {/* Thumbnail / icon */}
                  {p.media ? (
                    <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      {p.media.thumbnailUrl ? (
                        <Image
                          src={p.media.thumbnailUrl}
                          alt={p.media.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Receipt className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-foreground leading-snug">
                        {p.media?.title ?? "Subscription"}
                      </p>
                      <StatusBadge status={p.status} />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <TypeBadge type={p.type} />
                      <span className="text-xs text-muted-foreground">
                        {p.currency === "USD" ? "$" : "৳"}
                        {p.amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</span>
                    </div>

                    {/* Rental expiry */}
                    {p.type === "RENT" && p.expiresAt && (
                      <div
                        className={cn(
                          "flex items-center gap-1.5 text-xs",
                          active ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        {active ? (
                          <>
                            Rental active — {getRentalTimeLeft(p.expiresAt)}
                          </>
                        ) : (
                          <>Rental expired {formatDate(p.expiresAt)}</>
                        )}
                      </div>
                    )}

                    {/* Watch button */}
                    {canWatch && p.media && (
                      <Link
                        href={`/media-details/${p.media.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors mt-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Watch now
                      </Link>
                    )}
                  </div>

                  {/* Status icon */}
                  
                  <div className="shrink-0 self-center">
                    {p.status === "SUCCESS" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : p.status === "PENDING" ? (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
