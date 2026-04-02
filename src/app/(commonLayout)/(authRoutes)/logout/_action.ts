"use server";

import { deleteCookie } from "@/lib/cookieUtils";

export async function logoutAction() {
  try {
    // Clear authentication cookies
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    await deleteCookie("better-auth.session_token");
    
    return { success: true };
  } catch (error) {
    console.error("Error clearing cookies:", error);
    return { success: false };
  }
}
