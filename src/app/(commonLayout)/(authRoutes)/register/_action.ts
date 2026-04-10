/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClients";

import { setTokenInCookies } from "@/lib/tokenUtils";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

interface IRegisterUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  emailVerified: boolean;
  status: string;
  isDeleted: boolean;
}

interface IRegisterResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    token: string;
    user: IRegisterUser;
  };
}

interface ApiErrorResponse {
  success: false;
  message: string;
}

export const registerAction = async (
  payload: IRegisterPayload,
  redirectPath?: string
): Promise<ApiErrorResponse | void> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    const response = await httpClient.post<IRegisterResponse["data"]>(
      "/auth/register",
      {
        name: parsedPayload.data.name,
        email: parsedPayload.data.email,
        password: parsedPayload.data.password,
      }
    );

    const { accessToken, refreshToken, token, user } = response.data;
    const { role , emailVerified, email } = user;

    await setTokenInCookies("accessToken", accessToken);
    await setTokenInCookies("refreshToken", refreshToken);
    await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);

    if(!emailVerified) return redirect("/verify-email?email=" + encodeURIComponent(email));
    
    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role as UserRole)
        ? redirectPath
        : getDefaultDashboardRoute(role as UserRole);

    redirect(targetPath);
  } catch (error: any) {
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
      message: error?.response?.data?.message || `Register failed: ${error.message}`,
    };
  }
};
