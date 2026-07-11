import { Navigate, useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuthStore } from "@/store/auth.store";
import { safeInternalPath } from "@/lib/utils";

const Login = () => {
  const isAuthenticated = useAuthStore((s) => s.session.isAuthenticated);
  const [searchParams] = useSearchParams();

  // Já logado → não faz sentido ver o form de login (bookmark/histórico).
  if (isAuthenticated) {
    const next = safeInternalPath(
      searchParams.get("next") || searchParams.get("from"),
    );
    return <Navigate to={next} replace />;
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse sua conta para acompanhar pedidos e muito mais"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
