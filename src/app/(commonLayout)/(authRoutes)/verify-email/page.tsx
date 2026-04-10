import { Suspense } from "react";
import VerifyEmailForm from "@/components/modules/auth/VerifyEmailForm";

export const metadata = { title: "Verify Email — CineTube" };

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}