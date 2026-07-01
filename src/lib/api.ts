/**
 * API client tipado pro backend eco-back (NestJS @ /v1).
 *
 * - Header obrigatório: X-Tenant-Slug (resolve tenant)
 * - Token Bearer opcional, lido de localStorage 'eco_app_token'
 * - Adapta shape camelCase do backend pro shape snake_case que o front já consome
 *   (mantém compat com `Product` em src/data/products.ts e seus consumidores)
 */

import type { Product } from "@/data/products";

const API_BASE: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3000/v1";
const TENANT_SLUG: string =
  (import.meta.env.VITE_TENANT_SLUG as string | undefined) ?? "essence-arabe";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function authToken(): string | null {
  try {
    return typeof window !== "undefined" ? window.localStorage.getItem("eco_app_token") : null;
  } catch {
    return null;
  }
}

async function apiFetch<T>(
  path: string,
  init: RequestInit & { extraHeaders?: Record<string, string> } = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const { extraHeaders, ...rest } = init;
  const headers = new Headers(rest.headers);
  if (!headers.has("Content-Type") && rest.body) headers.set("Content-Type", "application/json");
  headers.set("X-Tenant-Slug", TENANT_SLUG);
  const token = authToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) {
      if (v != null) headers.set(k, v);
    }
  }

  let res: Response;
  try {
    res = await fetch(url, { ...rest, headers });
  } catch (err) {
    throw new ApiError(0, `Network error: ${(err as Error).message}`);
  }

  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      try {
        body = await res.text();
      } catch {
        /* noop */
      }
    }
    const message =
      (body && typeof body === "object" && "message" in body && String((body as any).message)) ||
      `HTTP ${res.status} on ${path}`;
    throw new ApiError(res.status, message, body);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

// ───────────────────────────────────────────────────────────
// Tipos do backend (camelCase) — refletem o shape real
// ───────────────────────────────────────────────────────────

interface BackendProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  audience: "Masculino" | "Feminino" | "Unissex";
  sizeMl: number;
  inspiredBy: string | null;
  tags: string[];
  priceBrl: number;
  availability: "in_stock" | "out_of_stock";
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
}

interface BackendProductDetail extends BackendProduct {
  description: string | null;
  weightGrams: number | null;
  images: string[];
  scentNotes: { top?: string[]; heart?: string[]; base?: string[] } | null;
  inspirationMeta: {
    priceEstimate?: number;
    accords?: string[];
    tagline?: string;
  } | null;
}

interface BackendProductsListResponse {
  data: BackendProduct[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ProductFacets {
  brands: { name: string; slug: string }[];
  sizes: number[];
  audiences: ("Masculino" | "Feminino" | "Unissex")[];
  priceMin: number;
  priceMax: number;
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  audience?: string;
  brand?: string; // brandSlug
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  sort?: "best_seller" | "price_asc" | "price_desc" | "newest";
}

export interface ProductsListResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface InspirationMeta {
  priceEstimate?: number;
  accords?: string[];
  tagline?: string;
}

/**
 * `Product` legado é snake_case. Backend devolve camelCase + alguns campos a menos
 * (stock, cost_usd, wholesale_usd). Defaults:
 *  - stock: in_stock ? 99 : 0 (não temos o número real expostos pela listagem)
 *  - cost_usd / wholesale_usd: null (não usados na UI pública)
 */
function adaptProduct(b: BackendProduct): Product {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    brand: b.brand,
    audience: b.audience,
    size_ml: b.sizeMl,
    inspired_by: b.inspiredBy,
    tags: [...(b.tags ?? [])],
    price_brl: Number(b.priceBrl),
    cost_usd: null,
    wholesale_usd: null,
    stock: b.availability === "in_stock" ? 99 : 0,
    availability: b.availability,
    is_best_seller: b.isBestSeller,
    is_new: b.isNew,
    rating: Number(b.rating),
    reviews_count: b.reviewsCount,
    image: b.image,
  };
}

export interface ProductDetail extends Product {
  description: string | null;
  images: string[];
  scentNotes: ScentNotes | null;
  inspirationMeta: InspirationMeta | null;
  weightGrams: number | null;
}

function adaptProductDetail(b: BackendProductDetail): ProductDetail {
  return {
    ...adaptProduct(b),
    description: b.description ?? null,
    images: Array.isArray(b.images) ? b.images : [],
    scentNotes: b.scentNotes
      ? {
          top: b.scentNotes.top ?? [],
          heart: b.scentNotes.heart ?? [],
          base: b.scentNotes.base ?? [],
        }
      : null,
    inspirationMeta: b.inspirationMeta ?? null,
    weightGrams: b.weightGrams ?? null,
  };
}

// ───────────────────────────────────────────────────────────
// Endpoints
// ───────────────────────────────────────────────────────────

function buildQuery(params: Record<string, string | number | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    usp.set(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

export async function getProducts(query: ProductsQuery = {}): Promise<ProductsListResult> {
  const qs = buildQuery({
    page: query.page,
    limit: query.limit,
    audience: query.audience,
    brand: query.brand,
    minPrice: query.minPrice,
    maxPrice: query.maxPrice,
    q: query.q,
    sort: query.sort,
  });
  const raw = await apiFetch<BackendProductsListResponse>(`/products${qs}`);
  return {
    items: raw.data.map(adaptProduct),
    total: raw.meta.total,
    page: raw.meta.page,
    limit: raw.meta.limit,
    totalPages: raw.meta.totalPages,
  };
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const raw = await apiFetch<BackendProduct[]>(`/products/featured${buildQuery({ limit })}`);
  return raw.map(adaptProduct);
}

export async function getProductFacets(): Promise<ProductFacets> {
  return apiFetch<ProductFacets>(`/products/facets`);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
  const raw = await apiFetch<BackendProductDetail>(`/products/slug/${encodeURIComponent(slug)}`);
  return adaptProductDetail(raw);
}

// ───────────────────────────────────────────────────────────
// Affiliate tracking
// ───────────────────────────────────────────────────────────

export interface AffiliateClickDto {
  code: string;
  sessionId: string;
  landingUrl?: string;
}

export async function postAffiliateClick(dto: AffiliateClickDto): Promise<{ tracked: boolean }> {
  return apiFetch<{ tracked: boolean }>(`/affiliates/clicks`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// ───────────────────────────────────────────────────────────
// Coupons (Slice 2)
// ───────────────────────────────────────────────────────────

export type DiscountType = "PERCENT" | "AMOUNT";

export type ValidateCouponResponse =
  | { valid: false; message?: string }
  | {
      valid: true;
      discountType: DiscountType;
      discountValue: number;
      discountAmount: number;
    };

export async function validateCoupon(
  code: string,
  cartTotal: number,
): Promise<ValidateCouponResponse> {
  return apiFetch<ValidateCouponResponse>(`/coupons/validate`, {
    method: "POST",
    body: JSON.stringify({ code, cartTotal }),
  });
}

// ───────────────────────────────────────────────────────────
// Shipping (Slice 2)
// ───────────────────────────────────────────────────────────

export interface CepLookupResponse {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export async function getAddressByCep(cep: string): Promise<CepLookupResponse> {
  const clean = (cep ?? "").replace(/\D/g, "");
  return apiFetch<CepLookupResponse>(`/shipping/cep/${encodeURIComponent(clean)}`);
}

export type ShippingMethodId = "STANDARD" | "EXPRESS_24H";

export interface ShippingQuoteItem {
  productId: string;
  quantity: number;
}

export interface ShippingQuoteOption {
  id: ShippingMethodId;
  label: string;
  price: number;
  estimatedDays: string;
}

export interface ShippingQuoteResponse {
  options: ShippingQuoteOption[];
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

export async function quoteShipping(payload: {
  cep: string;
  items: ShippingQuoteItem[];
}): Promise<ShippingQuoteResponse> {
  return apiFetch<ShippingQuoteResponse>(`/shipping/quote`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ───────────────────────────────────────────────────────────
// Orders (Slice 2)
// ───────────────────────────────────────────────────────────

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export type ValidateStockResponse =
  | { valid: true }
  | { valid: false; errors: { productId: string; reason: string }[] };

export async function validateOrderStock(payload: {
  items: OrderItemInput[];
}): Promise<ValidateStockResponse> {
  return apiFetch<ValidateStockResponse>(`/orders/validate-stock`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type PaymentMethod = "PIX" | "CARD" | "BOLETO" | "WHATSAPP_PAY";

export interface CreateOrderContact {
  fullName: string;
  whatsapp: string;
  email?: string;
  wantsWhatsAppUpdates?: boolean;
}

export interface CreateOrderDelivery {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  shippingMethodId: ShippingMethodId;
  name?: string;
  phone?: string;
  document?: string;
}

export interface CreateOrderPayload {
  contact: CreateOrderContact;
  delivery: CreateOrderDelivery;
  payment: { method: PaymentMethod };
  items: OrderItemInput[];
  couponCode?: string;
  affiliateRef?: string;
  // Order bump aceito no checkout. O back aplica o preço especial server-side.
  upsellOfferId?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  orderCode: string;
  status: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image: string | null;
  }[];
  createdAt: string;
  paymentString?: string;
  pixQrCode?: string;
  pixExternalId?: string;
  pixExpiresAt?: string;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "REFUNDED"
  | "EXPIRED"
  | "FULFILLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED"
  | "EXPIRED";

export interface OrderPaymentSummary {
  id: string;
  status: PaymentStatus;
  method: PaymentMethod;
  paidAt: string | null;
  paymentString?: string;
  pixQrCode?: string;
}

export interface OrderDetailResponse {
  orderCode: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  items: {
    productId: string;
    name: string;
    brand?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image: string | null;
  }[];
  payments: OrderPaymentSummary[];
  createdAt: string;
}

export async function getOrderByCode(orderCode: string): Promise<OrderDetailResponse> {
  return apiFetch<OrderDetailResponse>(`/orders/${encodeURIComponent(orderCode)}`);
}

export async function createOrder(
  payload: CreateOrderPayload,
  idempotencyKey: string,
  affiliateSessionId: string | null,
): Promise<CreateOrderResponse> {
  const extraHeaders: Record<string, string> = {
    "Idempotency-Key": idempotencyKey,
  };
  if (affiliateSessionId) {
    extraHeaders["x-affiliate-session"] = affiliateSessionId;
  }
  return apiFetch<CreateOrderResponse>(`/orders`, {
    method: "POST",
    body: JSON.stringify(payload),
    extraHeaders,
  });
}

// ───────────────────────────────────────────────────────────
// Offers — order bump do checkout
// ───────────────────────────────────────────────────────────

export interface CheckoutBump {
  offerId: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  ctaText: string;
  description?: string | null;
  expiresAt?: string | null;
  discountType: "PERCENT" | "AMOUNT";
  discountValue: number;
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    originalPrice: number;
    specialPrice: number;
  };
}

// Order bump ativo da loja (ou null). Preços aqui são só exibição — o real é server-side.
export async function getCheckoutBump(): Promise<CheckoutBump | null> {
  return apiFetch<CheckoutBump | null>(`/offers/checkout-bump`);
}

// ───────────────────────────────────────────────────────────
// Auth (Slice 4)
// ───────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  type: "CUSTOMER" | "AFFILIATE" | "TENANT_ADMIN" | "SUPER_ADMIN";
  tenantId: string;
  fullName: string;
  email: string | null;
  whatsapp: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface SignupPayload {
  fullName: string;
  email?: string;
  whatsapp?: string;
  password: string;
  type: "CUSTOMER";
}

export async function signupCustomer(payload: SignupPayload): Promise<AuthTokens> {
  return apiFetch<AuthTokens>(`/auth/signup`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export async function loginCustomer(payload: LoginPayload): Promise<AuthTokens> {
  return apiFetch<AuthTokens>(`/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshToken(refreshTokenValue: string): Promise<AuthTokens> {
  return apiFetch<AuthTokens>(`/auth/refresh`, {
    method: "POST",
    body: JSON.stringify({ refreshToken: refreshTokenValue }),
  });
}

export interface AuthMeProfile {
  receiveWhatsAppUpdates: boolean;
  receiveEmailUpdates: boolean;
  favoriteCategories: string[];
  referralCode: string | null;
}

export interface AuthMeResponse extends AuthUser {
  profile?: AuthMeProfile | null;
}

export async function getMe(): Promise<AuthMeResponse> {
  return apiFetch<AuthMeResponse>(`/auth/me`);
}

// ───────────────────────────────────────────────────────────
// Customer profile (Slice 4)
// ───────────────────────────────────────────────────────────

export type CustomerMe = AuthMeResponse;

export async function getCustomerMe(): Promise<CustomerMe> {
  return apiFetch<CustomerMe>(`/customers/me`);
}

export interface UpdateCustomerMePayload {
  fullName?: string;
  email?: string;
  whatsapp?: string;
  receiveWhatsAppUpdates?: boolean;
  receiveEmailUpdates?: boolean;
  favoriteCategories?: string[];
}

export async function updateCustomerMe(
  payload: UpdateCustomerMePayload,
): Promise<CustomerMe> {
  return apiFetch<CustomerMe>(`/customers/me`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: true; revokedSessions: number }> {
  return apiFetch<{ success: true; revokedSessions: number }>(
    `/customers/me/password`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

// ───────────────────────────────────────────────────────────
// Customer addresses (Slice 4)
// ───────────────────────────────────────────────────────────

export interface BackendAddress {
  id: string;
  label: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  reference: string | null;
  isDefault: boolean;
  name?: string | null;
  phone?: string | null;
  document?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressPayload {
  label: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
  name?: string;
  phone?: string;
  document?: string;
  isDefault?: boolean;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export async function getMyAddresses(): Promise<BackendAddress[]> {
  return apiFetch<BackendAddress[]>(`/customers/me/addresses`);
}

export async function createAddress(
  payload: CreateAddressPayload,
): Promise<BackendAddress> {
  return apiFetch<BackendAddress>(`/customers/me/addresses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(
  id: string,
  payload: UpdateAddressPayload,
): Promise<BackendAddress> {
  return apiFetch<BackendAddress>(`/customers/me/addresses/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(id: string): Promise<void> {
  await apiFetch<void>(`/customers/me/addresses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function setDefaultAddress(id: string): Promise<BackendAddress> {
  return apiFetch<BackendAddress>(
    `/customers/me/addresses/${encodeURIComponent(id)}/default`,
    { method: "POST" },
  );
}

// ───────────────────────────────────────────────────────────
// Orders (Slice 4) — listagem paginada do customer logado
// ───────────────────────────────────────────────────────────

export interface OrdersListItem {
  orderCode: string;
  status: OrderStatus;
  total: number;
  subtotal?: number;
  discount?: number;
  shippingCost?: number;
  createdAt: string;
  itemsCount?: number;
  items?: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    image: string | null;
  }[];
}

export interface OrdersListResponse {
  data: OrdersListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function getMyOrders(
  query: { page?: number; limit?: number } = {},
): Promise<OrdersListResponse> {
  const qs = buildQuery({ page: query.page, limit: query.limit });
  return apiFetch<OrdersListResponse>(`/orders${qs}`);
}

export { TENANT_SLUG, API_BASE };
