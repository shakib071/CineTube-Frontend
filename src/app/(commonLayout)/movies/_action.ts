"use server";

import { cookies } from "next/headers";
import { IMedia, IMediaListResponse } from "@/types/media.types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

export interface MediaQueryParams {
  type?: "MOVIE" | "SERIES";
  searchTerm?: string;
  genre?: string;
  platform?: string;
  pricingType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  isPublished?: boolean;
  minRating?: number;
}

export const getMediaAction = async (
  params: MediaQueryParams = {}
): Promise<{ success: boolean; data?: IMedia[]; meta?: IMediaListResponse["meta"]; message?: string }> => {
  try {
    const query: Record<string, string> = { isPublished: "true" };
    if (params.type) query.type = params.type;
    if (params.searchTerm) query.searchTerm = params.searchTerm;
    if (params.genre) query.genre = params.genre;
    if (params.platform) query.platform = params.platform;
    if (params.pricingType) query.pricingType = params.pricingType;
    if (params.sortBy) query.sortBy = params.sortBy;
    if (params.sortOrder) query.sortOrder = params.sortOrder;
    if (params.page) query.page = String(params.page);
    if (params.limit) query.limit = String(params.limit ?? 18);

    const qs = "?" + new URLSearchParams(query).toString();
    const res = await fetch(`${API}/media${qs}`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data, meta: data.meta };
  } catch {
    return { success: false, message: "Failed to fetch media" };
  }
};

export const getMediaByIdAction = async (
  id: string
): Promise<{ success: boolean; data?: IMedia; message?: string }> => {
  try {
    const res = await fetch(`${API}/media/${id}`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to fetch media" };
  }
};
