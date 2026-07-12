import { describe, it, expect } from "vitest";
import { pixQrImageSrc } from "@/lib/pix";

describe("pixQrImageSrc", () => {
  it("prefixa base64 cru de PNG (Mercado Pago) como data-URI de imagem", () => {
    const raw = "iVBORw0KGgoAAAANSUhEUgAAAAUA";
    expect(pixQrImageSrc(raw, "00020126EMV")).toBe(`data:image/png;base64,${raw}`);
  });

  it("passa o data-URI adiante sem duplicar prefixo (TCR)", () => {
    const dataUri = "data:image/png;base64,iVBORw0KGgoAAA";
    expect(pixQrImageSrc(dataUri, "00020126EMV")).toBe(dataUri);
  });

  it("cai no qrserver com o EMV quando não há imagem", () => {
    const emv = "00020126BR.GOV.BCB.PIX6304ABCD";
    const src = pixQrImageSrc(null, emv);
    expect(src).toContain("api.qrserver.com");
    expect(src).toContain(encodeURIComponent(emv));
    expect(src).not.toContain("undefined");
  });

  it("retorna null quando não há nem imagem nem EMV", () => {
    expect(pixQrImageSrc(null, null)).toBeNull();
    expect(pixQrImageSrc("", "")).toBeNull();
    expect(pixQrImageSrc(undefined, undefined)).toBeNull();
  });

  it("regressão bug B: nunca trata o EMV como imagem (sem data:image a partir do copia-e-cola)", () => {
    const emv = "00020126EMV";
    const src = pixQrImageSrc(undefined, emv);
    expect(src?.startsWith("data:")).toBe(false);
    expect(src).toContain("api.qrserver.com");
  });
});
