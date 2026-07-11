import { describe, it, expect } from "vitest";
import { isValidPhone, toNationalPhone } from "@/lib/validators";

describe("toNationalPhone", () => {
  it("converte E.164 do backend (+55 + 11 dígitos) pra formato nacional", () => {
    expect(toNationalPhone("+5518996718769")).toBe("(18) 99671-8769");
  });

  it("converte E.164 sem '+' (13 dígitos)", () => {
    expect(toNationalPhone("5511987654321")).toBe("(11) 98765-4321");
  });

  it("converte fixo com 55 (12 dígitos)", () => {
    expect(toNationalPhone("551133334444")).toBe("(11) 3333-4444");
  });

  it("NÃO remove 55 quando é DDD (11 dígitos, Santa Maria-RS)", () => {
    expect(toNationalPhone("55996718769")).toBe("(55) 99671-8769");
  });

  it("mantém número já nacional/formatado", () => {
    expect(toNationalPhone("(18) 99671-8769")).toBe("(18) 99671-8769");
    expect(toNationalPhone("18996718769")).toBe("(18) 99671-8769");
  });

  it("string vazia devolve vazia", () => {
    expect(toNationalPhone("")).toBe("");
  });

  it("resultado passa em isValidPhone quando a entrada é um E.164 válido", () => {
    expect(isValidPhone(toNationalPhone("+5518996718769"))).toBe(true);
  });
});

describe("isValidPhone (regressão do bug do checkout)", () => {
  it("E.164 cru do backend NÃO é válido — por isso o prefill precisa converter", () => {
    expect(isValidPhone("+5518996718769")).toBe(false);
  });
});
