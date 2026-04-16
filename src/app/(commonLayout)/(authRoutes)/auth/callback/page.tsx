/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleOAuthCallbackAction } from "./_action";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const redirect = searchParams.get("redirect") || "/user/dashboard";

    handleOAuthCallbackAction().then((result) => {
      if (result.success) {
        router.replace(redirect);
      } else {
        router.replace(`/login?error=${result.error}`);
      }
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>Signing you in...</p>
    </div>
  );
}