import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, MessageCircle, Package, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  getOrderByCode,
  type OrderDetailResponse,
  ApiError,
} from "@/lib/api";
import { handleAuthError } from "@/lib/auth-guard";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
    case "PENDING_PAYMENT":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    case "PAID":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "FULFILLED":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "CANCELLED":
    case "EXPIRED":
      return "bg-red-500/15 text-red-400 border-red-500/25";
    case "REFUNDED":
      return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    default:
      return "bg-[#111] text-muted-foreground border-[var(--glass-border)]";
  }
};

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    PENDING: "Aguardando pagamento",
    PENDING_PAYMENT: "Aguardando pagamento",
    PAID: "Pago",
    CANCELLED: "Cancelado",
    REFUNDED: "Reembolsado",
    EXPIRED: "Expirado",
    FULFILLED: "Entregue",
  };
  return map[status] || status;
};

const OrderDetails = () => {
  const { orderCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderCode) return;
    let active = true;
    setLoading(true);
    setNotFound(false);
    getOrderByCode(orderCode)
      .then((res) => {
        if (!active) return;
        setOrder(res);
      })
      .catch((err) => {
        if (!active) return;
        if (handleAuthError(err, navigate, location.pathname)) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          console.error("[OrderDetails] load failed", err);
          setNotFound(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderCode, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)]">
        <main className="pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="glass rounded-2xl p-6 border border-[var(--glass-border)] animate-pulse h-40" />
          </div>
        </main>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)]">
        <main className="pt-28 pb-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Pedido não encontrado
            </h1>
            <p className="text-muted-foreground/60 font-body mb-8">
              O pedido {orderCode} não foi encontrado.
            </p>
            <Link
              to="/conta/pedidos"
              className="inline-flex items-center gap-2 shine-effect bg-gradient-gold text-[#080808]
                font-body font-bold py-3 px-6 rounded-xl text-sm
                hover:-translate-y-0.5 hover:shadow-gold-md
                transition-all duration-250 ease-expo-out"
            >
              Voltar para pedidos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const whatsappMessage = `Oi! Gostaria de informações sobre meu pedido ${order.orderCode}.`;
  const whatsappUrl = `https://wa.me/5518996718769?text=${encodeURIComponent(whatsappMessage)}`;

  // Timeline derivada do status do backend (sem "EM_SEPARACAO"/"ENVIADO"
  // separados no contrato atual — colapsa em PAID → FULFILLED)
  const timelineSteps = [
    {
      key: "CONFIRMED",
      label: "Pedido Confirmado",
      icon: CheckCircle,
      completed: true,
    },
    {
      key: "PAID",
      label: "Pagamento Aprovado",
      icon: Package,
      completed: ["PAID", "FULFILLED"].includes(order.status),
    },
    {
      key: "FULFILLED",
      label: "Enviado / Entregue",
      icon: Truck,
      completed: order.status === "FULFILLED",
    },
  ];

  const isPendingPayment =
    order.status === "PENDING" ||
    (order as { status: string }).status === "PENDING_PAYMENT";

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/conta/pedidos"
            className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
              transition-colors duration-200 mb-8 font-body text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Voltar para pedidos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Pedido {order.orderCode}
              </h1>
              <p className="text-muted-foreground/60 font-body text-sm mt-1">
                Realizado em{" "}
                {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={cn(
                "self-start text-sm font-body font-semibold px-4 py-1.5 rounded-full border",
                getStatusColor(order.status),
              )}
            >
              {statusLabel(order.status)}
            </span>
          </motion.div>

          {isPendingPayment && (
            <div className="glass-gold rounded-2xl p-5 border border-gold/25 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm font-body text-foreground">
                Este pedido está <strong>aguardando pagamento</strong>. Finalize
                via PIX para confirmar a compra.
              </p>
              <Link
                to={`/pedido/${order.orderCode}`}
                className="shine-effect bg-gradient-gold text-[#080808]
                  font-body font-bold py-2.5 px-5 rounded-xl text-sm
                  hover:-translate-y-0.5 hover:shadow-gold-sm
                  transition-all duration-250 ease-expo-out whitespace-nowrap"
              >
                Ver pagamento PIX
              </Link>
            </div>
          )}

          <div className="space-y-5">
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-base font-semibold text-foreground mb-5">
                Acompanhamento
              </h2>
              <div className="space-y-0">
                {timelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === timelineSteps.length - 1;
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: i * 0.08,
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border shrink-0",
                            step.completed
                              ? "bg-gold/15 border-gold/40"
                              : "bg-[#111] border-[var(--glass-border)]",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-3.5 h-3.5",
                              step.completed
                                ? "text-gold"
                                : "text-muted-foreground/30",
                            )}
                          />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 my-1.5 bg-gradient-to-b from-gold/30 to-transparent" />
                        )}
                      </div>
                      <div className={`${isLast ? "pb-0" : "pb-5"}`}>
                        <p
                          className={cn(
                            "font-body font-semibold text-sm",
                            step.completed
                              ? "text-foreground"
                              : "text-muted-foreground/40",
                          )}
                        >
                          {step.label}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-base font-semibold text-foreground mb-5">
                Itens do Pedido
              </h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 bg-[var(--bg-elevated)] rounded-xl"
                  >
                    {item.image && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#111] shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-foreground text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground/60 font-body">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="font-display font-bold text-gold text-sm shrink-0">
                      {formatMoney(Number(item.totalPrice))}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-gold rounded-2xl p-5 border border-gold/20 space-y-2">
              <div className="flex justify-between text-sm font-body text-muted-foreground/80">
                <span>Subtotal</span>
                <span>{formatMoney(Number(order.subtotal))}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-sm font-body text-muted-foreground/80">
                  <span>Desconto</span>
                  <span>- {formatMoney(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-body text-muted-foreground/80">
                <span>Frete</span>
                <span>{formatMoney(Number(order.shippingCost))}</span>
              </div>
              <div className="pt-2 border-t border-gold/20 flex justify-between items-center">
                <span className="font-display font-semibold text-foreground">
                  Total do Pedido
                </span>
                <span className="font-display text-2xl font-bold text-gold">
                  {formatMoney(Number(order.total))}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 shine-effect flex items-center justify-center gap-2 bg-gradient-gold text-[#080808]
                  font-body font-bold py-3.5 rounded-xl text-sm
                  hover:-translate-y-0.5 hover:shadow-gold-md
                  transition-all duration-250 ease-expo-out"
              >
                <MessageCircle className="w-4 h-4" />
                Falar no WhatsApp
              </a>
              <Link
                to="/conta/pedidos"
                className="flex-1 glass rounded-xl py-3.5 text-sm font-body font-semibold
                  text-foreground border border-[var(--glass-border)]
                  flex items-center justify-center gap-2
                  hover:border-gold/30 hover:text-gold
                  transition-all duration-200"
              >
                Ver todos os pedidos
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
