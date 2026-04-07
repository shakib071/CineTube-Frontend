import Link from "next/link";
import { XCircle, ArrowLeft, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Payment Cancelled — CineTube",
};

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Payment Cancelled</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your payment was not completed. No charge was made to your account.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold">
            <Link href="/subscription">
              <Crown className="w-4 h-4 mr-2" />
              Try again
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 rounded-xl font-semibold">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
