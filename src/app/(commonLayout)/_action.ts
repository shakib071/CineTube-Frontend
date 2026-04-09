"use server";

import { cookies } from "next/headers";
import { IMedia } from "@/types/media.types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
};

const fetchMedia = async (qs: string): Promise<IMedia[]> => {
  try {
    const res = await fetch(`${API}/media?isPublished=true&${qs}`, {
      headers: { Cookie: await getCookieHeader() },
      next: { revalidate: 300 }, // cache 5 min
    });
    const data = await res.json();
    return res.ok ? (data.data ?? []) : [];
  } catch {
    return [];
  }
};

export const getHeroMediaAction = async (): Promise<IMedia | null> => {
  const items = await fetchMedia("isFeatured=true&sortBy=averageRating&sortOrder=desc&limit=1");
  return items[0] ?? null;
};

export const getTopRatedAction = async (): Promise<IMedia[]> =>
  fetchMedia("sortBy=averageRating&sortOrder=desc&limit=8");

export const getNewlyAddedAction = async (): Promise<IMedia[]> =>
  fetchMedia("sortBy=createdAt&sortOrder=desc&limit=8");

export const getEditorPicksAction = async (): Promise<IMedia[]> =>
  fetchMedia("isFeatured=true&sortBy=createdAt&sortOrder=desc&limit=8");

export const subscribeNewsletterAction = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await fetch(`${API}/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message ?? "Subscription failed" };
    return { success: true, message: "You're subscribed!" };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
};
