import ForgotPasswordForm from "@/components/modules/auth/ForgotPasswordForm";

export const metadata = { title: "Forgot Password — CineTube" };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <ForgotPasswordForm />
    </div>
  );
}
