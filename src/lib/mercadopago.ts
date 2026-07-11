// Loader do SDK v2 do Mercado Pago + instância única do cliente Bricks.
// Carrega o script sob demanda (só quando o cliente escolhe cartão) e só quando
// a public key está configurada — sem key, o checkout mantém "cartão em breve".

const SDK_URL = "https://sdk.mercadopago.com/js/v2";
const PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY as string | undefined;

/** Tipagem mínima do que consumimos do SDK (o pacote não traz @types). */
interface MpBrickController {
  unmount: () => void;
}
interface MpBricksBuilder {
  create: (
    brick: string,
    containerId: string,
    settings: Record<string, unknown>,
  ) => Promise<MpBrickController>;
}
interface MpInstance {
  bricks: () => MpBricksBuilder;
}
type MpConstructor = new (
  publicKey: string,
  options?: { locale?: string },
) => MpInstance;

declare global {
  interface Window {
    MercadoPago?: MpConstructor;
  }
}

export function isMercadoPagoConfigured(): boolean {
  return typeof PUBLIC_KEY === "string" && PUBLIC_KEY.length > 0;
}

let sdkPromise: Promise<MpConstructor> | null = null;

function loadSdk(): Promise<MpConstructor> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("SDK do Mercado Pago indisponível fora do browser"));
  }
  if (window.MercadoPago) return Promise.resolve(window.MercadoPago);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<MpConstructor>((resolve, reject) => {
    const onLoad = () => {
      if (window.MercadoPago) resolve(window.MercadoPago);
      else reject(new Error("SDK do Mercado Pago carregou sem expor MercadoPago"));
    };
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar o SDK")));
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = onLoad;
    script.onerror = () => reject(new Error("Falha ao carregar o SDK do Mercado Pago"));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

let mpInstance: MpInstance | null = null;

/** Instância única do MercadoPago (Bricks). Lança se a public key não estiver setada. */
export async function getMercadoPago(): Promise<MpInstance> {
  if (!isMercadoPagoConfigured()) {
    throw new Error("Mercado Pago não configurado (VITE_MP_PUBLIC_KEY ausente)");
  }
  if (mpInstance) return mpInstance;
  const MercadoPago = await loadSdk();
  mpInstance = new MercadoPago(PUBLIC_KEY as string, { locale: "pt-BR" });
  return mpInstance;
}
