import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { OrderReview } from "@/components/checkout/OrderReview";
import { useCartStore } from "@/store/cart.store";

// O Brick depende do SDK do Mercado Pago (rede) — mocka pra um marcador que
// expõe o amount recebido, sem carregar o iframe.
vi.mock("@/components/checkout/CardPaymentBrick", () => ({
  CardPaymentBrick: (props: { amount: number }) => (
    <div data-testid="brick" data-amount={props.amount} />
  ),
}));

const product = {
  id: "p1",
  slug: "dalal",
  name: "Dalal",
  brand: "ESSENCE",
  price_brl: 100,
  image: null,
  size_ml: 100,
} as never;

const contact = {
  name: "Fulano",
  email: "a@b.com",
  phone: "11999999999",
  wantsWhatsAppUpdates: false,
} as never;

const shipping = {
  cep: "01001000",
  address: "Rua X",
  number: "1",
  complement: "",
  neighborhood: "Centro",
  city: "SP",
  state: "SP",
  shippingMethod: "normal",
} as never;

function renderReview(overrides: Record<string, unknown> = {}) {
  const props = {
    contact,
    shipping,
    paymentMethod: "card" as const,
    onPaymentMethodChange: () => {},
    shippingPrice: 10,
    acceptTerms: false,
    onAcceptTerms: () => {},
    bumpItem: null as { name: string; price: number } | null,
    mpConfigured: true,
    payerEmail: "a@b.com",
    onCardSubmit: async () => {},
    ...overrides,
  };
  // @ts-expect-error fixtures mínimas
  return render(<OrderReview {...props} />);
}

beforeEach(() => {
  useCartStore.setState({ items: [{ product, quantity: 1 }], coupon: null } as never);
});

describe("OrderReview — order bump no total + Brick sempre visível", () => {
  it("soma o bump no total exibido e no amount do Brick", () => {
    renderReview({ bumpItem: { name: "Amostra 5ml", price: 50 } });
    // total = 100 (item) + 10 (frete) + 50 (bump) = 160
    expect(screen.getByText(/160,00/)).toBeInTheDocument();
    expect(screen.getByText(/Amostra 5ml/)).toBeInTheDocument();
    // Brick recebeu o amount JÁ com o bump (parcelas sobre o valor final).
    expect(screen.getByTestId("brick").getAttribute("data-amount")).toBe("160");
  });

  it("sem bump, total = itens + frete (Brick idem)", () => {
    renderReview({ bumpItem: null });
    expect(screen.getByText(/110,00/)).toBeInTheDocument();
    expect(screen.getByTestId("brick").getAttribute("data-amount")).toBe("110");
  });

  it("renderiza o Brick mesmo com termos NÃO aceitos (visível sempre)", () => {
    renderReview({ acceptTerms: false });
    expect(screen.getByTestId("brick")).toBeInTheDocument();
    expect(screen.getByText(/Marque o aceite dos termos/)).toBeInTheDocument();
  });
});
