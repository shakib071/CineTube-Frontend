import LoginForm from "@/components/modules/auth/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
  const params = await searchParams;
  const redirectPath = params.redirect;

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <LoginForm redirectPath={redirectPath} />
    </div>
  );
};

export default LoginPage;
