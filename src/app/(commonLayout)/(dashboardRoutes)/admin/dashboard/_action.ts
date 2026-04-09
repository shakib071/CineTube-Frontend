"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join("; ");
};

export interface IAdminStats {
  users:         { total: number; active: number; inactive: number };
  media:         { total: number; movies: number; series: number };
  reviews:       { total: number; pending: number; approved: number };
  newsletter:    { totalSubscribers: number };
  subscriptions: { active: number };
  revenue:       { total: number };
  recentPurchases: {
    id: string;
    type: string;
    amount: number;
    status: string;
    currency: string;
    createdAt: string;
    user:  { id: string; name: string; email: string } | null;
    media: { id: string; title: string } | null;
  }[];
}

export interface INewsletterSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export const getAdminStatsAction = async (): Promise<
  { success: true; data: IAdminStats } | { success: false; message: string }
> => {
  try {
    const res = await fetch(`${API}/stats/admin`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Failed to fetch stats" };
  }
};

export const getNewsletterSubscribersAction = async (): Promise<
  { success: true; data: { subscribers: INewsletterSubscriber[]; total: number } } | { success: false; message: string }
> => {
  try {
    const res = await fetch(`${API}/newsletter`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };
    return { success: true, data: json.data };
  } catch {
    return { success: false, message: "Failed to fetch subscribers" };
  }
};
