import Link from "next/link";
import { CheckCircle2, Crown, ArrowRight, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Payment Successful — CineTube",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Payment Successful!</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your subscription has been activated. You now have full access to all
            premium content on CineTube.
          </p>
        </div>

        {/* Info card */}
        <div className="rounded-2xl border border-border/50 bg-card p-5 text-left space-y-3">
          <div className="flex items-center gap-2 text-amber-500">
            <Crown className="w-4 h-4" />
            <span className="text-sm font-semibold">Premium access activated</span>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              Unlimited premium movies &amp; series
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              HD &amp; 4K streaming
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              Access starts immediately
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold">
            <Link href="/all-media">
              <Film className="w-4 h-4 mr-2" />
              Browse content
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 rounded-xl font-semibold">
            <Link href="/user/dashboard/purchase-history">
              View receipt
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <Link
          href="/profile"
          className="inline-block text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Go to profile
        </Link>
      </div>
    </div>
  );
}
