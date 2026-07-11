import { useEffect, useRef } from "react";
import { getMercadoPago } from "@/lib/mercadopago";
import type { OrderCardPayload } from "@/lib/api";

interface CardBrickFormData {
  token: string;
  payment_method_id: string;
  issuer_id?: string | number;
  installments: number | string;
  payer?: { email?: string; identification?: { number?: string } };
}

interface Props {
  /** Total do pedido — usado pelo Brick pra montar as opções de parcelamento. */
  amount: number;
  payerEmail?: string;
  /** Recebe os dados tokenizados. Deve REJEITAR em falha pra o Brick reabilitar o form. */
  onCardSubmit: (data: OrderCardPayload) => Promise<void>;
}

const CONTAINER_ID = "cardPaymentBrick_container";

/**
 * Renderiza o CardPayment Brick do Mercado Pago (cartão em iframe — PCI SAQ A,
 * dado de cartão nunca toca nosso back). O botão de pagar é do próprio Brick;
 * o `onSubmit` do Brick chama `onCardSubmit` com o token single-use.
 */
export function CardPaymentBrick({ amount, payerEmail, onCardSubmit }: Props) {
  // onCardSubmit muda de identidade a cada render (closure) — ref garante que o
  // callback do Brick sempre use a versão atual sem remontar o Brick.
  const submitRef = useRef(onCardSubmit);
  submitRef.current = onCardSubmit;

  useEffect(() => {
    let cancelled = false;
    let controller: { unmount: () => void } | null = null;

    void (async () => {
      try {
        const mp = await getMercadoPago();
        if (cancelled) return;
        controller = await mp.bricks().create("cardPayment", CONTAINER_ID, {
          initialization: {
            amount,
            ...(payerEmail ? { payer: { email: payerEmail } } : {}),
          },
          customization: {
            paymentMethods: { maxInstallments: 12 },
            visual: { style: { theme: "dark" } },
          },
          callbacks: {
            onReady: () => undefined,
            onError: () => undefined,
            onSubmit: (formData: CardBrickFormData) =>
              submitRef.current({
                token: formData.token,
                paymentMethodId: formData.payment_method_id,
                issuerId:
                  formData.issuer_id != null ? String(formData.issuer_id) : undefined,
                installments: Number(formData.installments),
                payerEmail: formData.payer?.email ?? payerEmail ?? "",
                payerDocument: formData.payer?.identification?.number ?? "",
              }),
          },
        });
      } catch {
        // Falha de SDK/render é silenciosa aqui — a UI mostra o fallback textual.
      }
    })();

    return () => {
      cancelled = true;
      if (controller && typeof controller.unmount === "function") controller.unmount();
    };
    // Remonta quando o valor muda (order bump altera o total).
  }, [amount, payerEmail]);

  return <div id={CONTAINER_ID} />;
}
