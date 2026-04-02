import RegisterForm from "@/components/modules/auth/RegisterForm";

interface RegisterPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

const RegisterPage = async ({ searchParams }: RegisterPageProps) => {
  const params = await searchParams;
  const redirectPath = params.redirect;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <RegisterForm redirectPath={redirectPath} />
    </div>
  );
};

export default RegisterPage;
