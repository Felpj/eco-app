import { describe, it, expect } from "vitest";
import {
  orderStatusLabel,
  orderStatusColor,
  orderTimeline,
} from "@/lib/order-status";

describe("orderStatusLabel", () => {
  it("rotula os estados de envio reais do enum (sem o FULFILLED fantasma)", () => {
    expect(orderStatusLabel("PENDING_PAYMENT")).toBe("Aguardando pagamento");
    expect(orderStatusLabel("PAID")).toBe("Pago");
    expect(orderStatusLabel("FULFILLING")).toBe("Em separação");
    expect(orderStatusLabel("SHIPPED")).toBe("Enviado");
    expect(orderStatusLabel("DELIVERED")).toBe("Entregue");
    expect(orderStatusLabel("CANCELLED")).toBe("Cancelado");
    expect(orderStatusLabel("REFUNDED")).toBe("Reembolsado");
  });

  it("faz fallback legível pra status desconhecido", () => {
    expect(orderStatusLabel("ALGO_NOVO")).toBe("ALGO NOVO");
  });
});

describe("orderTimeline", () => {
  const done = (status: string) =>
    Object.fromEntries(orderTimeline(status).map((s) => [s.key, s.completed]));

  it("SHIPPED acende Pagamento e Enviado, mas não Entregue", () => {
    const t = done("SHIPPED");
    expect(t.PAID).toBe(true);
    expect(t.SHIPPED).toBe(true);
    expect(t.DELIVERED).toBe(false);
  });

  it("DELIVERED acende toda a linha", () => {
    const t = done("DELIVERED");
    expect(t.PAID).toBe(true);
    expect(t.SHIPPED).toBe(true);
    expect(t.DELIVERED).toBe(true);
  });

  it("PAID e FULFILLING ainda não acendem Enviado", () => {
    expect(done("PAID").SHIPPED).toBe(false);
    expect(done("FULFILLING").SHIPPED).toBe(false);
    expect(done("FULFILLING").PAID).toBe(true);
  });

  it("PENDING_PAYMENT só tem o passo Confirmado", () => {
    const t = done("PENDING_PAYMENT");
    expect(t.PAID).toBe(false);
    expect(t.SHIPPED).toBe(false);
  });

  it("CANCELLED não acende Pagamento/Enviado/Entregue", () => {
    const t = done("CANCELLED");
    expect(t.PAID).toBe(false);
    expect(t.SHIPPED).toBe(false);
    expect(t.DELIVERED).toBe(false);
  });
});

describe("orderStatusColor", () => {
  it("SHIPPED e DELIVERED têm cor própria (não caem no default)", () => {
    const def = orderStatusColor("ZZZ");
    expect(orderStatusColor("SHIPPED")).not.toBe(def);
    expect(orderStatusColor("DELIVERED")).not.toBe(def);
  });
});
