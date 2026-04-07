"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
};

export const getWatchlistAction = async () => {
  try {
    const res = await fetch(`${API}/watchlist`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to fetch watchlist" };
  }
};

export const checkWatchlistAction = async (mediaId: string) => {
  try {
    const res = await fetch(`${API}/watchlist/check/${mediaId}`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, isInWatchlist: false };
    return { success: true, isInWatchlist: data.data?.isInWatchlist ?? false };
  } catch {
    return { success: false, isInWatchlist: false };
  }
};

export const addToWatchlistAction = async (mediaId: string) => {
  try {
    const res = await fetch(`${API}/watchlist/${mediaId}`, {
      method: "POST",
      headers: { Cookie: await getCookieHeader() },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/watchlist");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to add to watchlist" };
  }
};

export const removeFromWatchlistAction = async (mediaId: string) => {
  try {
    const res = await fetch(`${API}/watchlist/${mediaId}`, {
      method: "DELETE",
      headers: { Cookie: await getCookieHeader() },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/watchlist");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to remove from watchlist" };
  }
};
