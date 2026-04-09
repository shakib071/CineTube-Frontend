"use server";

import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};


export const getUserStatsAction = async () => {
    
    try{
        const res = await fetch(`${API}/stats/user`, {
            headers: { Cookie: await getCookieHeader() },
            cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) return { success: false, message: data.message };
        return { success: true, data: data.data };

    }
    catch {
        return { success: false, message: "Failed to fetch user stats" };
    }
}