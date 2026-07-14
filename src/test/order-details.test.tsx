import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import OrderDetails from "@/pages/account/OrderDetails";
import * as api from "@/lib/api";

const baseOrder = {
  orderCode: "ESS-1",
  status: "SHIPPED",
  subtotal: 100,
  discount: 0,
  shippingCost: 10,
  total: 110,
  tracking: {
    carrier: "Correios",
    code: "AA123456789BR",
    url: "https://linkcorreios.com.br/?id=AA123456789BR",
  },
  items: [
    {
      productId: "p1",
      name: "Yara 100ml",
      quantity: 1,
      unitPrice: 100,
      totalPrice: 100,
      image: null,
    },
  ],
  payments: [],
  createdAt: "2026-07-13T12:00:00Z",
} as unknown as api.OrderDetailResponse;

function renderAt(order: api.OrderDetailResponse) {
  vi.spyOn(api, "getOrderByCode").mockResolvedValue(order);
  return render(
    <MemoryRouter initialEntries={["/conta/pedidos/ESS-1"]}>
      <Routes>
        <Route path="/conta/pedidos/:orderCode" element={<OrderDetails />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("OrderDetails — rastreio e timeline (render real)", () => {
  it("SHIPPED renderiza código de rastreio, transportadora e link de rastrear", async () => {
    renderAt(baseOrder);

    expect(await screen.findByText("AA123456789BR")).toBeInTheDocument();
    expect(screen.getByText("Correios")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Rastrear pedido/i });
    expect(link).toHaveAttribute(
      "href",
      "https://linkcorreios.com.br/?id=AA123456789BR",
    );

    // Label PT correto no badge (não o status cru "SHIPPED").
    expect(screen.getAllByText("Enviado").length).toBeGreaterThan(0);
    expect(screen.queryByText("SHIPPED")).not.toBeInTheDocument();
  });

  it("pedido sem tracking não renderiza o card de rastreio", async () => {
    renderAt({
      ...baseOrder,
      status: "PAID",
      tracking: null,
    } as api.OrderDetailResponse);

    expect(await screen.findByText("Yara 100ml")).toBeInTheDocument();
    expect(screen.queryByText("Rastreio da Entrega")).not.toBeInTheDocument();
  });
});
