/**
 * Slice 4 — helper de tratamento de 401 em chamadas autenticadas.
 * Se a API retornar 401, desloga o usuário e redireciona pro login.
 *
 * Uso:
 *   try { await getCustomerMe(); }
 *   catch (e) { handleAuthError(e, navigate, location.pathname); }
 */
import { ApiError } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { type NavigateFunction } from "react-router-dom";

export function handleAuthError(
  err: unknown,
  navigate: NavigateFunction,
  fromPath?: string,
): boolean {
  if (err instanceof ApiError && err.status === 401) {
    useAuthStore.getState().logout();
    const from = encodeURIComponent(fromPath ?? "/conta");
    navigate(`/entrar?from=${from}&next=${from}`, { replace: true });
    return true;
  }
  return false;
}
