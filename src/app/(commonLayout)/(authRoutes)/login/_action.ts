/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClients";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

interface ILoginUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  emailVerified: boolean;
  status: string;
  isDeleted: boolean;
}

interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    token: string;
    user: ILoginUser;
  };
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string
): Promise<ApiErrorResponse | void> => {
  // step 1 — validate with zod on server
  const parsedPayload = loginZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    // step 2 — call backend API
    const response = await httpClient.post<ILoginResponse["data"]>(
      "/auth/login",
      parsedPayload.data
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role , emailVerified, email } = user;

    if (!emailVerified) {
      redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    }

    // step 3 — save tokens in httpOnly cookies
    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies(
      "better-auth.session_token",
      token,
      24 * 60 * 60 // 1 day
    );

    
    // step 4 — redirect based on role
    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    redirect(targetPath);
  } catch (error: any) {
    // re-throw Next.js redirect errors
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      success: false,
      message: error?.response?.data?.message || `Login failed: ${error.message}`,
    };
  }
};
