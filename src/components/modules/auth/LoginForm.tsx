"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */


import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import type { AnyFieldApi } from "@tanstack/react-form";
import { AlertCircle, Eye, EyeOff, Loader2, Tv } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { loginAction } from "@/app/(commonLayout)/(authRoutes)/login/_action";

// ── Types ────────────────────────────────────────────
interface LoginFormProps {
  redirectPath?: string;
}

// ── Field error helper ────────────────────────────────
const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  }
  return String(error);
};

// ── AppField component ────────────────────────────────
const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
}: {
  field: AnyFieldApi;
  label: string;
  type?: string;
  placeholder?: string;
  append?: React.ReactNode;
}) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={field.name}
        className={cn(
          "text-white/80 text-sm",
          firstError && "text-red-400"
        )}
      >
        {label}
      </Label>
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={!!firstError}
          className={cn(
            "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-red-500 focus:ring-red-500/20 h-11",
            append && "pr-12",
            firstError && "border-red-500/50 focus:border-red-500"
          )}
        />
        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-1">
            {append}
          </div>
        )}
      </div>
      {firstError && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {firstError}
        </p>
      )}
    </div>
  );
};

// ── Main LoginForm ────────────────────────────────────
const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) =>
      loginAction(payload, redirectPath),
  });


  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;
        if (result && !result.success) {
          setServerError(result.message || "Login failed");
        }
      } catch (error: any) {
        setServerError(`Login failed: ${error.message}`);
      }
    },
  });

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
        <span
          className="text-2xl font-black "
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
        >
          Cine<span className="text-red-500">Tube</span>
        </span>
      </div>

      <Card className="bg-zinc-900/80 border-white/10 backdrop-blur-sm shadow-2xl shadow-black/60">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-white/50">
            Sign in to continue watching
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* Email field */}
            <form.Field
              name="email"
              validators={{ onChange: loginZodSchema.shape.email }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                />
              )}
            </form.Field>

            {/* Password field */}
            <form.Field
              name="password"
              validators={{ onChange: loginZodSchema.shape.password }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  append={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-white/40 hover:text-white hover:bg-transparent w-9 h-9"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-red-400 hover:text-red-300 hover:underline underline-offset-4 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Server error */}
            {serverError && (
              <Alert className="bg-red-500/10 border-red-500/30 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* Submit button */}
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting || isPending}
                  className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-zinc-900 text-white/30">
                or continue with
              </span>
            </div>
          </div>

          {/* Google login */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-all duration-200"
            onClick={() => {
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
              window.location.href = `${baseUrl}/auth/login/google`;
            }}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t border-white/10 pt-4">
          <p className="text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-red-400 font-medium hover:text-red-300 hover:underline underline-offset-4 transition-colors"
            >
              Create account
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Back to home */}
      <p className="text-center mt-6 text-sm text-white/30">
        <Link href="/" className="hover:text-white/60 transition-colors">
          ← Back to home
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
