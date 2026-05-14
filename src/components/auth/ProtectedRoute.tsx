import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { session } = useAuthStore();
  const location = useLocation();

  // Sem accessToken válido → redireciona pro login com `from`/`next` preservados.
  // Slice 4: token vem de auth.store (session.token); compat com sessão legada (sem token).
  const hasAccess = session.isAuthenticated;

  if (!hasAccess) {
    const from = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/entrar?from=${from}&next=${from}`} replace />;
  }

  return <>{children}</>;
};
