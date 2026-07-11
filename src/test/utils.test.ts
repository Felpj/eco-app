import { describe, it, expect } from "vitest";
import { safeInternalPath } from "@/lib/utils";

describe("safeInternalPath (redirect pós-login)", () => {
  it("aceita path interno", () => {
    expect(safeInternalPath("/conta/pedidos")).toBe("/conta/pedidos");
    expect(safeInternalPath("/checkout?x=1")).toBe("/checkout?x=1");
  });

  it("rejeita URL absoluta e protocol-relative (open redirect)", () => {
    expect(safeInternalPath("https://evil.com")).toBe("/conta");
    expect(safeInternalPath("//evil.com")).toBe("/conta");
    expect(safeInternalPath("/\\evil.com")).toBe("/conta");
    expect(safeInternalPath("javascript:alert(1)")).toBe("/conta");
  });

  it("null/vazio caem no fallback", () => {
    expect(safeInternalPath(null)).toBe("/conta");
    expect(safeInternalPath("")).toBe("/conta");
    expect(safeInternalPath(null, "/")).toBe("/");
  });
});
