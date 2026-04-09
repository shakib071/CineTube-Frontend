import Link from "next/link";
import { Crown, Zap, Check } from "lucide-react";

const PLANS = [
  {
    key: "FREE",
    label: "Free",
    price: "$0",
    period: "forever",
    Icon: Zap,
    iconColor: "text-muted-foreground",
    features: [
      "Access to free movies & series",
      "Write and read reviews",
      "Watchlist",
      "Community comments & likes",
    ],
    cta: "Get started",
    href: "/register",
    highlight: false,
    badge: null,
  },
  {
    key: "MONTHLY",
    label: "Monthly",
    price: "$9.99",
    period: "per month",
    Icon: Crown,
    iconColor: "text-red-500",
    features: [
      "Everything in Free",
      "Unlimited premium movies & series",
      "HD & 4K streaming",
      "Cancel anytime",
    ],
    cta: "Subscribe monthly",
    href: "/subscription",
    highlight: true,
    badge: "Most Popular",
  },
  {
    key: "YEARLY",
    label: "Yearly",
    price: "$79.99",
    period: "per year",
    Icon: Crown,
    iconColor: "text-amber-500",
    features: [
      "Everything in Monthly",
      "Priority customer support",
      "Early access to new titles",
      "Family sharing (up to 4 screens)",
    ],
    cta: "Subscribe yearly",
    href: "/subscription",
    highlight: false,
    badge: "Save 33%",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-foreground">Choose your plan</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Unlock unlimited premium content at any budget
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.key}
            className={`relative flex flex-col rounded-2xl border p-6 bg-card transition-all duration-300 ${
              plan.highlight
                ? "border-red-500/60 shadow-[0_8px_32px_rgba(239,68,68,0.12)] scale-[1.02]"
                : "border-border/50 hover:border-red-500/30 hover:shadow-[0_4px_20px_rgba(239,68,68,0.07)]"
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold text-white ${
                    plan.highlight ? "bg-red-600" : "bg-amber-500"
                  }`}
                >
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3 mt-1">
              <plan.Icon className={`w-4 h-4 ${plan.iconColor}`} />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {plan.label}
              </span>
            </div>

            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-bold text-foreground">{plan.price}</span>
              <span className="text-sm text-muted-foreground mb-1">/{plan.period}</span>
            </div>

            <ul className="space-y-2.5 my-5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-colors ${
                plan.highlight
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border border-border hover:bg-muted text-foreground"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
