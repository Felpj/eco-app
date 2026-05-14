/**
 * Captura `?ref=CODE` em qualquer rota pública.
 *
 * - Dispara `trackAffiliateClick(code)` em fire-and-forget.
 * - Remove o `?ref` da URL via `history.replaceState` (clean URL).
 * - Preserva os demais query params.
 * - sessionId continua no localStorage (não é apagado).
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackAffiliateClick } from "@/lib/affiliate-tracking";

export function useAffiliateCapture(): void {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(location.search);
    const code = params.get("ref");
    if (!code) return;

    // Fire-and-forget — não aguarda; erros são engolidos internamente.
    void trackAffiliateClick(code);

    // Remove ?ref preservando demais params.
    params.delete("ref");
    const remaining = params.toString();
    const newUrl = `${window.location.pathname}${remaining ? `?${remaining}` : ""}${window.location.hash}`;
    try {
      window.history.replaceState(window.history.state, "", newUrl);
    } catch {
      /* noop */
    }
  }, [location.search]);
}
