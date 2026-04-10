import { Suspense } from "react";
import ResetPasswordForm from "@/components/modules/auth/ResetPasswordForm";

export const metadata = { title: "Reset Password — CineTube" };

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
