import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CustomerProfile, AuthSession } from "@/types/account";

/**
 * Bridge para api.ts:
 * api.ts lê `localStorage.getItem("eco_app_token")` para popular Authorization.
 * Mantemos esse contrato espelhando o accessToken aqui em todo set/clear.
 */
const TOKEN_LS_KEY = "eco_app_token";

function writeTokenToLS(token: string | null) {
  try {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem(TOKEN_LS_KEY, token);
    else window.localStorage.removeItem(TOKEN_LS_KEY);
  } catch {
    /* noop */
  }
}

interface AuthStore {
  session: AuthSession;
  profile: CustomerProfile | null;
  /**
   * Login com tokens reais (Slice 4).
   * Aceita também a forma legada (apenas profile) para compat com componentes antigos.
   */
  login: (
    profileOrPayload:
      | CustomerProfile
      | {
          profile: CustomerProfile;
          accessToken: string;
          refreshToken: string;
        },
  ) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: {
        isAuthenticated: false,
      },
      profile: null,

      login: (payload) => {
        // Distingue payload novo (com tokens) do legado (só profile)
        const hasTokens =
          payload != null &&
          typeof payload === "object" &&
          "accessToken" in payload &&
          "profile" in payload;

        if (hasTokens) {
          const p = payload as {
            profile: CustomerProfile;
            accessToken: string;
            refreshToken: string;
          };
          writeTokenToLS(p.accessToken);
          set({
            session: {
              isAuthenticated: true,
              customerId: p.profile.id,
              token: p.accessToken,
              refreshToken: p.refreshToken,
            },
            profile: p.profile,
          });
        } else {
          const profile = payload as CustomerProfile;
          set({
            session: {
              isAuthenticated: true,
              customerId: profile.id,
            },
            profile,
          });
        }
      },

      setTokens: (accessToken, refreshToken) => {
        writeTokenToLS(accessToken);
        set((state) => ({
          session: {
            ...state.session,
            isAuthenticated: true,
            token: accessToken,
            refreshToken,
          },
        }));
      },

      logout: () => {
        writeTokenToLS(null);
        set({
          session: {
            isAuthenticated: false,
            customerId: undefined,
            token: undefined,
            refreshToken: undefined,
          },
          profile: null,
        });
      },

      updateProfile: (updates) => {
        set((state) => {
          if (!state.profile) return state;
          return {
            profile: {
              ...state.profile,
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },
    }),
    {
      name: "EA_AUTH_SESSION_V1",
      // Após rehydrate (refresh da página), reespelha o token no LS para api.ts
      onRehydrateStorage: () => (state) => {
        if (state?.session?.token) {
          writeTokenToLS(state.session.token);
        }
      },
    },
  ),
);
