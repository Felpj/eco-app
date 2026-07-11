import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Redirect pós-login: só aceita path interno ("/x"), nunca "//host" ou URL
 * absoluta vinda da query string. Qualquer outra coisa cai no fallback.
 */
export function safeInternalPath(raw: string | null, fallback = "/conta"): string {
  if (raw && /^\/(?!\/)/.test(raw)) return raw;
  return fallback;
}
