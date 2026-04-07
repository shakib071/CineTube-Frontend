"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Crown, Check, Zap, Loader2, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ISubscription, SubscriptionPlan } from "@/types/payment.types";
import { cn } from "@/lib/utils";
import { createStripeSubscriptionAction } from "@/app/(commonLayout)/subscription/_action";

interface Props {
  currentSub: ISubscription | null;
}

const PLANS: {
  key: SubscriptionPlan;
  label: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight: boolean;
  badge?: string;
}[] = [
  {
    key: "FREE",
    label: "Free",
    price: "$0",
    period: "forever",
    description: "Browse and review free content.",
    highlight: false,
    features: [
      "Access to free movies & series",
      "Write and read reviews",
      "Watchlist",
      "Community comments & likes",
    ],
  },
  {
    key: "MONTHLY",
    label: "Monthly",
    price: "$9.99",
    period: "per month",
    description: "Full access, billed monthly.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "Unlimited premium movies & series",
      "HD & 4K streaming",
      "Download for offline viewing",
      "Cancel anytime",
    ],
  },
  {
    key: "YEARLY",
    label: "Yearly",
    price: "$79.99",
    period: "per year",
    description: "Best value — save 33% vs monthly.",
    highlight: false,
    badge: "Best Value",
    features: [
      "Everything in Monthly",
      "Priority customer support",
      "Early access to new titles",
      "Family sharing (up to 4 screens)",
    ],
  },
];

const isActive = (sub: ISubscription | null) =>
  sub?.status === "ACTIVE" && new Date(sub.endDate) > new Date();

export default function SubscriptionPlansClient({ currentSub }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<SubscriptionPlan | null>(null);

  const activePlan: SubscriptionPlan = isActive(currentSub)
    ? (currentSub!.plan as SubscriptionPlan)
    : "FREE";

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (plan === "FREE") return;
    setLoading(plan);
    const res = await createStripeSubscriptionAction(plan);
    setLoading(null);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    router.push(res.url);
  };

  const formatEndDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl font-bold text-foreground">Subscription Plans</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Unlock unlimited premium content
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Current plan banner */}
        {isActive(currentSub) && (
          <div className="mb-10 flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4">
            <BadgeCheck className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-foreground">
                You&apos;re on the {currentSub!.plan.toLowerCase()} plan
              </span>
              <span className="text-muted-foreground">
                {" "}— renews on {formatEndDate(currentSub!.endDate)}
              </span>
            </div>
          </div>
        )}

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isCurrent = activePlan === plan.key;
            const isLoadingThis = loading === plan.key;

            return (
              <Card
                key={plan.key}
                className={cn(
                  "relative flex flex-col rounded-2xl border transition-all duration-300",
                  plan.highlight
                    ? "border-red-500/60 shadow-[0_8px_32px_rgba(239,68,68,0.12)] scale-[1.02]"
                    : "border-border/50 hover:border-red-500/30 hover:shadow-[0_4px_20px_rgba(239,68,68,0.08)]"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                      className={cn(
                        "px-3 py-0.5 text-xs font-semibold",
                        plan.highlight
                          ? "bg-red-600 text-white"
                          : "bg-amber-500 text-white"
                      )}
                    >
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4 pt-7">
                  <div className="flex items-center gap-2 mb-1">
                    {plan.key === "FREE" && <Zap className="w-4 h-4 text-muted-foreground" />}
                    {plan.key === "MONTHLY" && <Crown className="w-4 h-4 text-red-500" />}
                    {plan.key === "YEARLY" && <Crown className="w-4 h-4 text-amber-500" />}
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {plan.label}
                    </span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground mb-1">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 gap-5">
                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.key === "FREE" ? (
                    <div
                      className={cn(
                        "w-full rounded-xl py-2.5 text-sm font-semibold text-center border border-border/50 text-muted-foreground",
                        isCurrent && "bg-muted"
                      )}
                    >
                      {isCurrent ? "Current plan" : "Free forever"}
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.key)}
                      disabled={isCurrent || isLoadingThis}
                      className={cn(
                        "w-full rounded-xl font-semibold",
                        plan.highlight
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {isLoadingThis ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isCurrent ? (
                        "Current plan"
                      ) : (
                        `Get ${plan.label}`
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-10">
          Payments are processed securely via Stripe. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
}
