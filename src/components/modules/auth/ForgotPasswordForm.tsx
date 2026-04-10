"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Send, Tv } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/app/(commonLayout)/(authRoutes)/auth/_action";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const res = await forgotPasswordAction(email.trim());
    setLoading(false);

    if (!res.success) {
      setError((res as any).message);
      return;
    }

    // Move to reset-password page carrying the email
    router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="relative">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Tv className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-400 rounded-full animate-pulse" />
        </div>
        <span className="text-2xl font-black" style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}>
          Cine<span className="text-red-500">Tube</span>
        </span>
      </div>

      <Card className="bg-zinc-900/80 border-white/10 backdrop-blur-sm shadow-2xl shadow-black/60">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Forgot password?</CardTitle>
          <CardDescription className="text-white/50">
            Enter your email and we&apos;ll send you a reset OTP
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label className="text-white/80 text-sm">Email address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500 h-11"
              />
            </div>

            {error && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending OTP…</>
              ) : (
                <><Send className="w-4 h-4 mr-2" />Send reset OTP</>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-white/10 pt-4">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to login
          </Link>
        </CardFooter>
      </Card>

      <p className="text-center mt-6 text-sm ">
        <Link href="/" className="hover:text-red-500 transition-colors">← Back to home</Link>
      </p>
    </div>
  );
}
