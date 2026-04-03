
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const updateProfileAction = async (formData: FormData) => {
  const cookieStore = await cookies();
  
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value


    const res = await fetch(
        `${baseURL}/user/edit-profile`,
        {
            method: "PATCH",
            headers: {
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
            },
            body: formData,
        }
    );

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || "Update failed" };
  }

  revalidatePath("/profile");
  return { success: true, data: data.data };
};