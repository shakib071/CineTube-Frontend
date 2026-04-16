"use server";

import { cookies } from "next/headers";
import { setTokenInCookies } from "@/lib/tokenUtils";

export async function handleOAuthCallbackAction(): Promise<
  { success: true; redirect: string } | { success: false; error: string }
> {
  try {
    const cookieStore = await cookies();

    // Forward all cookies (includes __Secure-better-auth.session_token set by oAuthProxy)
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/google/success`,
      {
        method: "GET",
        headers: { Cookie: cookieHeader },
      }
    );

    const data = await res.json();
    

    if (!res.ok || !data.success) {
      return { success: false, error: "oauth_failed" };
    }

    const { accessToken, refreshToken, sessionToken } = data.data;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      sessionToken,
      24 * 60 * 60
    );

    return { success: true, redirect: data.data.redirect || "/user/dashboard" };
  } catch (e) {
    console.error("OAuth callback error:", e);
    return { success: false, error: "oauth_failed" };
  }
}