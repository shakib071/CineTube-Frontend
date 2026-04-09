"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export const getReviewsByMediaAction = async (
  mediaId: string,
  page = 1,
  limit = 5
) => {
  try {
    const qs = new URLSearchParams({
      mediaId,
      page: String(page),
      limit: String(limit),
    });
    const res = await fetch(`${API}/reviews/public?${qs}`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data, meta: data.meta };
  } catch {
    return { success: false, message: "Failed to fetch reviews" };
  }
};

export const createReviewAction = async (payload: {
  mediaId: string;
  rating: number;
  review_content: string;
  hasSpoiler: boolean;
  tags: string[];
}) => {
  try {
    const res = await fetch(`${API}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookieHeader(),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath(`/media-details/${payload.mediaId}`);
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to submit review" };
  }
};

export const toggleLikeAction = async (reviewId: string) => {
  try {
    const res = await fetch(`${API}/reviews/${reviewId}/like`, {
      method: "POST",
      headers: { Cookie: await getCookieHeader() },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to toggle like" };
  }
};

// ── Comments ──────────────────────────────────────────────────────────────────

export const addCommentAction = async (
  reviewId: string,
  content: string,
  parentId?: string
) => {
  try {
    const res = await fetch(`${API}/reviews/${reviewId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookieHeader(),
      },
      body: JSON.stringify({ content, ...(parentId && { parentId }) }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to add comment" };
  }
};

export const deleteCommentAction = async (commentId: string) => {
  try {
    const res = await fetch(`${API}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Cookie: await getCookieHeader() },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true };
  } catch {
    return { success: false, message: "Failed to delete comment" };
  }
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getAllReviewsAdminAction = async (
  params?: Record<string, string>
) => {
  try {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await fetch(`${API}/reviews${qs}`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data, meta: data.meta };
  } catch {
    return { success: false, message: "Failed to fetch reviews" };
  }
};

export const approveRejectReviewAction = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  try {
    const res = await fetch(`${API}/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookieHeader(),
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/admin/dashboard/reviews");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to update review" };
  }
};

export const deleteReviewAdminAction = async (id: string) => {
  try {
    const res = await fetch(`${API}/reviews/${id}`, {
      method: "DELETE",
      headers: { Cookie: await getCookieHeader() },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/admin/dashboard/reviews");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to delete review" };
  }
};

export const checkAccessAction = async (mediaId: string): Promise<boolean> => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/purchase/access/${mediaId}`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const json = await res.json();
    return json.data?.hasAccess === true;
  } catch {
    return false;
  }
};
