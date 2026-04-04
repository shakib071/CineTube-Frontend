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

export const getAllUsersAction = async (params?: Record<string, string>) => {
  try {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await fetch(`${API}/admin/users${query}`, {
      headers: { Cookie: await getCookieHeader() },
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    return { success: true, data: data.data, meta: data.meta };
  } catch {
    return { success: false, message: "Failed to fetch users" };
  }
};

export const blockUnblockUserAction = async (
  id: string,
  userStatus: "ACTIVE" | "BLOCKED" | "SUSPENDED"
) => {
  try {
    const res = await fetch(`${API}/admin/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: await getCookieHeader(),
      },
      body: JSON.stringify({ status: userStatus }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/admin/dashboard/users");
    return { success: true, data: data.data };
  } catch {
    return { success: false, message: "Failed to update user status" };
  }
};

export const deleteUserAction = async (id: string) => {
  try {
    const res = await fetch(`${API}/admin/users/${id}`, {
      method: "DELETE",
      headers: { Cookie: await getCookieHeader() },
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: data.message };
    revalidatePath("/admin/dashboard/users");
    return { success: true };
  } catch {
    return { success: false, message: "Failed to delete user" };
  }
};
