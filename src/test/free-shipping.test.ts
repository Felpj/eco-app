import { describe, it, expect } from "vitest";
import { freeShippingBar } from "@/lib/free-shipping";

describe("freeShippingBar", () => {
  it("retorna null quando a loja desativou o frete grátis (threshold null)", () => {
    expect(freeShippingBar(null, null)).toBeNull();
  });

  it("retorna null quando não há dado de quanto falta", () => {
    expect(freeShippingBar(299, null)).toBeNull();
  });

  it("faltando R$99: não alcançado, progresso proporcional", () => {
    const bar = freeShippingBar(299, 99)!;
    expect(bar.reached).toBe(false);
    expect(bar.remaining).toBe(99);
    expect(bar.progress).toBeCloseTo((299 - 99) / 299);
  });

  it("faltando R$0: alcançado, barra cheia", () => {
    const bar = freeShippingBar(299, 0)!;
    expect(bar.reached).toBe(true);
    expect(bar.remaining).toBe(0);
    expect(bar.progress).toBe(1);
  });

  it("progresso é limitado entre 0 e 1", () => {
    // remaining maior que o threshold não deixa o progresso negativo
    expect(freeShippingBar(100, 250)!.progress).toBe(0);
  });
});
