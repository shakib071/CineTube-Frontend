"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

// ── Get all media ─────────────────────────────────────
export const getAllMediaAction = async (params?: Record<string, string>) => {
  try {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await fetch(`${API}/media${query}`, {
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

// ── Create media ──────────────────────────────────────
export const createMediaAction = async (formData: FormData) => {
  try {
    const res = await fetch(`${API}/media`, {
      method: "POST",
      headers: { Cookie: await getCookieHeader() },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/admin/dashboard/media");
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to create media" };
  }
};

// ── Update media ──────────────────────────────────────
export const updateMediaAction = async (id: string, formData: FormData) => {
  try {
    const res = await fetch(`${API}/media/${id}`, {
      method: "PATCH",
      headers: { Cookie: await getCookieHeader() },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/admin/dashboard/media");
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to update media" };
  }
};

// ── Delete media ──────────────────────────────────────
export const deleteMediaAction = async (id: string) => {
  try {
    const res = await fetch(`${API}/media/${id}`, {
      method: "DELETE",
      headers: { Cookie: await getCookieHeader() },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/admin/dashboard/media");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to delete media" };
  }
};
