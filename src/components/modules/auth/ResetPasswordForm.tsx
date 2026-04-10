"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff,
  Loader2, RefreshCw, ShieldCheck, Tv,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  resetPasswordAction,
  resendForgotPasswordAction,
} from "@/app/(commonLayout)/(authRoutes)/auth/_action";

const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 60;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // OTP expiry countdown
  const [otpTimer, setOtpTimer] = useState(OTP_EXPIRY_SECONDS);
  const otpExpired = otpTimer === 0;

  // Resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);
  const canResend = resendCooldown === 0;

  useEffect(() => {
    if (done || otpTimer === 0) return;
    const t = setInterval(() => setOtpTimer((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [done, otpTimer]);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const t = setInterval(() => setResendCooldown((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleResend = useCallback(async () => {
    if (!email.trim() || !canResend) return;
    setResendLoading(true);
    setResendMsg(null);
    setError(null);

    const res = await resendForgotPasswordAction(email.trim());
    setResendLoading(false);

    if (!res.success) {
      setError((res as any).message);
      return;
    }

    setOtpTimer(OTP_EXPIRY_SECONDS);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    setOtp("");
    setResendMsg("A new OTP has been sent to your email.");
  }, [email, canResend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);
    setResendMsg(null);

    const res = await resetPasswordAction(email.trim(), otp.trim(), newPassword);
    setLoading(false);

    if (!res.success) {
      setError((res as any).message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
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
              <ShieldCheck className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Reset password</CardTitle>
          <CardDescription className="text-white/50">
            Enter the OTP from your email and your new password
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
              <p className="text-white font-semibold">Password reset!</p>
              <p className="text-white/50 text-sm">Redirecting to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500 h-11"
                />
              </div>

              {/* OTP */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80 text-sm">OTP code</Label>
                  <span className={`text-xs font-mono tabular-nums ${otpExpired ? "text-red-400" : "text-white/40"}`}>
                    {otpExpired ? "OTP expired" : `Expires in ${formatTime(otpTimer)}`}
                  </span>
                </div>
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  disabled={otpExpired}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500 h-11 tracking-widest text-center text-lg font-semibold disabled:opacity-40"
                />
              </div>

              {/* Resend row */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">Didn&apos;t receive it?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || resendLoading || !email.trim()}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {resendLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  {canResend ? "Resend OTP" : `Resend in ${resendCooldown}s`}
                </button>
              </div>

              {resendMsg && (
                <Alert className="bg-green-500/10 border-green-500/30 text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription>{resendMsg}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* New password */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm">New password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500 h-11 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 text-white/40 hover:text-white hover:bg-transparent w-10"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label className="text-white/80 text-sm">Confirm new password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500 h-11"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !otp || !newPassword || !confirmPassword || otpExpired}
                className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting…</>
                ) : (
                  "Reset password"
                )}
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-white/10 pt-4">
          <Link
            href="/forgot-password"
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </CardFooter>
      </Card>

      <p className="text-center mt-6 text-sm text-white/30">
        <Link href="/" className="hover:text-white/60 transition-colors">← Back to home</Link>
      </p>
    </div>
  );
}
