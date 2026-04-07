"use server";

import { cookies } from "next/headers";
import { ISubscription, IPurchase, SubscriptionPlan } from "@/types/payment.types";
import { ApiResponse } from "@/types/api.types";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const store = await cookies();
  return store.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
};

// ── Subscription ──────────────────────────────────────────────────────────────

export const getMySubscriptionAction = async (): Promise<
  { success: true; data: ISubscription | null } | { success: false; message: string }
> => {
  try {
    const res = await fetch(`${API}/subscription/me`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const json: ApiResponse<ISubscription | null> = await res.json();
    if (!res.ok) return { success: false, message: (json as unknown as { message: string }).message };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Failed to fetch subscription" };
  }
};

export const createStripeSubscriptionAction = async (
  plan: SubscriptionPlan
): Promise<{ success: true; url: string } | { success: false; message: string }> => {
  try {
    const res = await fetch(`${API}/subscription/stripe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookieHeader(),
      },
      body: JSON.stringify({ plan }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };
    return { success: true, url: json.data.url };
  } catch {
    return { success: false, message: "Failed to create payment session" };
  }
};

// ── Purchase ──────────────────────────────────────────────────────────────────

export const getPurchaseHistoryAction = async (): Promise<
  { success: true; data: IPurchase[] } | { success: false; message: string }
> => {
  try {
    const res = await fetch(`${API}/purchase`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const json: ApiResponse<IPurchase[]> = await res.json();
    if (!res.ok) return { success: false, message: (json as unknown as { message: string }).message };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Failed to fetch purchase history" };
  }
};

export const createPurchaseAction = async (
  mediaId: string,
  type: "BUY" | "RENT"
): Promise<{ success: true; url: string } | { success: false; message: string }> => {
  try {
    const res = await fetch(`${API}/purchase/${mediaId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookieHeader(),
      },
      body: JSON.stringify({ type, paymentGateway: "STRIPE" }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };
    return { success: true, url: json.data.url };
  } catch {
    return { success: false, message: "Failed to initiate purchase" };
  }
};
