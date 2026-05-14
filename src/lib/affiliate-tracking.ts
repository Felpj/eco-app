/**
 * Affiliate tracking helpers (Slice 1).
 *
 * - sessionId persiste em localStorage por 30 dias.
 * - Captura de ?ref=CODE em qualquer rota pública → POST /affiliates/clicks
 *   em fire-and-forget. Erros são engolidos (não bloqueiam render).
 * - sessionId é exposto via `getAffiliateSessionId()` para futuros slices
 *   (ex.: header `x-affiliate-session` no POST /orders).
 */

import { postAffiliateClick } from "@/lib/api";

const SESSION_KEY = "essence_aff_session";
const SESSION_AT_KEY = "essence_aff_session_at";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

function generateUuidV4(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* fallthrough */
  }
  // Fallback (não deveria ser usado em browsers modernos).
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function isExpired(timestamp: string | null): boolean {
  if (!timestamp) return true;
  const at = Number(timestamp);
  if (!Number.isFinite(at)) return true;
  return Date.now() - at > SESSION_TTL_MS;
}

/**
 * Lê (não cria) o sessionId atual. Retorna `null` se vazio ou expirado.
 */
export function getAffiliateSessionId(): string | null {
  if (!hasStorage()) return null;
  try {
    const id = window.localStorage.getItem(SESSION_KEY);
    const at = window.localStorage.getItem(SESSION_AT_KEY);
    if (!id || isExpired(at)) return null;
    return id;
  } catch {
    return null;
  }
}

/**
 * Lê ou cria um sessionId. Regenera se expirado (>30d).
 * Sempre atualiza timestamp ao criar.
 */
export function getOrCreateAffiliateSessionId(): string {
  if (!hasStorage()) {
    // Sem storage: ainda gera um id efêmero pra fechar o request.
    return generateUuidV4();
  }
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    const at = window.localStorage.getItem(SESSION_AT_KEY);
    if (existing && !isExpired(at)) return existing;
    const fresh = generateUuidV4();
    window.localStorage.setItem(SESSION_KEY, fresh);
    window.localStorage.setItem(SESSION_AT_KEY, String(Date.now()));
    return fresh;
  } catch {
    return generateUuidV4();
  }
}

/**
 * Fire-and-forget: registra um click de afiliado. Não throwa.
 */
export async function trackAffiliateClick(code: string): Promise<void> {
  const trimmed = (code ?? "").trim();
  if (!trimmed) return;
  try {
    const sessionId = getOrCreateAffiliateSessionId();
    const landingUrl =
      typeof window !== "undefined" && window.location ? window.location.href : undefined;
    await postAffiliateClick({ code: trimmed, sessionId, landingUrl });
  } catch {
    // Engole erros: tracking não pode quebrar UX.
  }
}
