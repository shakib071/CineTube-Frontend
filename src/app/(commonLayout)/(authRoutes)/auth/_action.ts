/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClients";
import { deleteCookie } from "@/lib/cookieUtils";

interface ApiError {
  success: false;
  message: string;
}

// ── Verify email with OTP ─────────────────────────────────────────────────────
export const verifyEmailAction = async (
  email: string,
  otp: string
): Promise<ApiError | { success: true }> => {
  try {
    await httpClient.post("/auth/verify-email", { email, otp });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Email verification failed",
    };
  }
};

// ── Resend email verification OTP ─────────────────────────────────────────────
export const resendVerifyEmailAction = async (
  email: string
): Promise<ApiError | { success: true }> => {
  try {
    await httpClient.post("/auth/resend-verify-email", { email });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to resend OTP",
    };
  }
};

// ── Request forgot password OTP ───────────────────────────────────────────────
export const forgotPasswordAction = async (
  email: string
): Promise<ApiError | { success: true }> => {
  try {
    await httpClient.post("/auth/forget-password", { email });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to send OTP",
    };
  }
};

// ── Resend forgot password OTP ────────────────────────────────────────────────
export const resendForgotPasswordAction = async (
  email: string
): Promise<ApiError | { success: true }> => {
  try {
    await httpClient.post("/auth/resend-forget-password", { email });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to resend OTP",
    };
  }
};

// ── Reset password with OTP ───────────────────────────────────────────────────
export const resetPasswordAction = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<ApiError | { success: true }> => {
  try {
    await httpClient.post("/auth/reset-password", { email, otp, newPassword });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Password reset failed",
    };
  }
};


export const changePasswordAction = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message?: string }> => {
  try {
     await httpClient.post("/auth/change-password", { currentPassword, newPassword });
    // const res = await fetch(`${API}/auth/change-password`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Cookie: await getCookieHeader(),
    //   },
    //   body: JSON.stringify({ currentPassword, newPassword }),
    // });
    
    // if (!res.ok) return { success: false, message: data.message ?? "Failed to change password" };

    // Clear all cookies — force re-login after password change
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");

    return { success: true };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
};