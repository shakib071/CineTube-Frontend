/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleOAuthCallbackAction } from "../_action";


export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const sessionToken = searchParams.get("sessionToken");
        const redirect = searchParams.get("redirect") || "/user/dashboard";
        console.log("Received tokens:", { accessToken, refreshToken, sessionToken, redirect });

        if (!accessToken || !refreshToken) {
            router.replace("/login?error=oauth_failed");
            return;
        }

        handleOAuthCallbackAction(accessToken, refreshToken, sessionToken!, redirect)
            .then((result:any) => {
                if (result?.error) {
                    router.replace(`/login?error=${result.error}`);
                } else {
                    router.replace(redirect);
                }
            });
    }, []);

    return <div>Signing you in...</div>;
}