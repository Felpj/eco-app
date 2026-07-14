// Progresso da barra "faltam R$X pra frete grátis". Deriva do que o back manda
// na quote (freeShippingThreshold + amountToFreeShipping). Retorna null quando
// não há frete grátis pra essa loja (lojista desativou → threshold null) ou a
// quote ainda não veio.

export interface FreeShippingBar {
  reached: boolean;
  remaining: number; // R$ que faltam (0 quando já alcançou)
  progress: number; // 0..1
}

export function freeShippingBar(
  freeShippingThreshold: number | null,
  amountToFreeShipping: number | null,
): FreeShippingBar | null {
  if (
    freeShippingThreshold == null ||
    amountToFreeShipping == null ||
    freeShippingThreshold <= 0
  ) {
    return null;
  }
  const remaining = Math.max(0, amountToFreeShipping);
  const reached = remaining === 0;
  const progress = Math.min(
    1,
    Math.max(0, (freeShippingThreshold - remaining) / freeShippingThreshold),
  );
  return { reached, remaining, progress };
}
