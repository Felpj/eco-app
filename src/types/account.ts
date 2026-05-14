/**
 * Tipos para conta do cliente (Front-only)
 */

export interface CustomerProfile {
  id: string;
  fullName: string;
  email?: string;
  whatsapp: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  customerId?: string;
  token?: string; // accessToken (Bearer)
  refreshToken?: string;
}

export type AddressLabel = "Casa" | "Trabalho" | "Outro" | string;

/**
 * Address — shape unificado front/backend.
 * Mantém `addressLine1`/`addressLine2` legados pra compat com OrderDetails,
 * mas reflete o shape do backend (street/number/complement) como source of truth.
 */
export interface Address {
  id: string;
  label: AddressLabel;
  cep: string;
  // Backend canonical fields (Slice 4)
  street?: string;
  number?: string;
  complement?: string;
  // Legacy aliases (alguns componentes ainda usam) — derivados de street/number
  addressLine1: string;
  addressLine2?: string;
  neighborhood: string;
  city: string;
  state: string;
  reference?: string;
  isDefault: boolean;
  // Recipient overrides (opcionais no backend)
  name?: string;
  phone?: string;
  document?: string;
}

export type OrderStatus =
  | "CONFIRMADO"
  | "EM_SEPARACAO"
  | "ENVIADO"
  | "ENTREGUE"
  | "CANCELADO";

export interface OrderTracking {
  carrier?: string;
  code?: string;
  url?: string;
}

export interface CustomerOrder {
  orderCode: string; // EA-YYYYMMDD-XXXX
  status: OrderStatus;
  total: number;
  items: Array<{
    name: string;
    qty: number;
    price: number;
    image?: string;
  }>;
  createdAt: string;
  tracking?: OrderTracking;
  contact?: {
    fullName: string;
    whatsapp: string;
    email?: string;
  };
  delivery?: {
    addressLine1: string;
    addressLine2?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  payment?: {
    method: string;
  };
}

export interface CustomerPreferences {
  receiveWhatsAppUpdates: boolean;
  receiveEmailUpdates: boolean;
  favoriteCategories: string[];
}
