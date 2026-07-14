// Rótulos, cores e timeline do status do pedido — fonte única espelhando o
// enum OrderStatus do back (eco-back prisma/schema.prisma). Antes cada tela
// tinha o seu mapa, todos travados num "FULFILLED" que NÃO existe no enum —
// então "Enviado/Entregue" nunca acendia. Aqui fica correto e centralizado.

const LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  PENDING_PAYMENT: "Aguardando pagamento",
  PAID: "Pago",
  FULFILLING: "Em separação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
  // aliases legados (telas/respostas antigas)
  PENDING: "Aguardando pagamento",
  EXPIRED: "Expirado",
};

export function orderStatusLabel(status: string): string {
  return LABELS[status] ?? status.replace(/_/g, " ");
}

export function orderStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
    case "PENDING_PAYMENT":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    case "PAID":
    case "FULFILLING":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "SHIPPED":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "DELIVERED":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "CANCELLED":
    case "EXPIRED":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "REFUNDED":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    default:
      return "bg-[#111] text-muted-foreground border-[var(--glass-border)]";
  }
}

// Ordem de progresso do pedido; CANCELLED/REFUNDED não avançam a linha.
const RANK: Record<string, number> = {
  DRAFT: 0,
  PENDING: 0,
  PENDING_PAYMENT: 0,
  PAID: 1,
  FULFILLING: 2,
  SHIPPED: 3,
  DELIVERED: 4,
};

export interface TimelineStep {
  key: "CONFIRMED" | "PAID" | "SHIPPED" | "DELIVERED";
  label: string;
  completed: boolean;
}

export function orderTimeline(status: string): TimelineStep[] {
  const terminated = status === "CANCELLED" || status === "REFUNDED";
  const rank = RANK[status] ?? 0;
  const reached = (n: number) => !terminated && rank >= n;
  return [
    { key: "CONFIRMED", label: "Pedido Confirmado", completed: true },
    { key: "PAID", label: "Pagamento Aprovado", completed: reached(1) },
    { key: "SHIPPED", label: "Enviado", completed: reached(3) },
    { key: "DELIVERED", label: "Entregue", completed: reached(4) },
  ];
}
