import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { getMyOrders, type OrdersListItem } from "@/lib/api";
import { handleAuthError } from "@/lib/auth-guard";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
    case "PENDING_PAYMENT":
    case "CONFIRMADO":
      return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "PAID":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "FULFILLED":
    case "ENTREGUE":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "CANCELLED":
    case "CANCELADO":
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
  return map[status] || status.replace("_", " ");
};

const LIMIT = 10;

const OrdersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<OrdersListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMyOrders({ page, limit: LIMIT })
      .then((res) => {
        if (!active) return;
        setOrders(res.data);
        setTotalPages(res.meta.totalPages || 1);
        setTotal(res.meta.total);
      })
      .catch((err) => {
        if (!handleAuthError(err, navigate, location.pathname)) {
          console.error("[OrdersList] load failed", err);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, navigate, location.pathname]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link
            to="/conta"
            className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
              transition-colors duration-200 mb-8 font-body text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Voltar para conta
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Meus Pedidos
          </h1>
          {!loading && total > 0 && (
            <p className="text-muted-foreground/60 font-body text-sm mb-8">
              {total} pedido{total !== 1 ? "s" : ""} no total
            </p>
          )}

          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-5 border border-[var(--glass-border)] animate-pulse h-20"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass border border-[var(--glass-border)]
                flex items-center justify-center">
                <Package className="w-9 h-9 text-muted-foreground/30" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Você ainda não tem pedidos
              </h2>
              <p className="text-muted-foreground/60 font-body text-sm mb-8">
                Que tal explorar nosso catálogo e fazer sua primeira compra?
              </p>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 shine-effect bg-gradient-gold text-[#080808]
                  font-body font-bold py-3 px-6 rounded-xl text-sm
                  hover:-translate-y-0.5 hover:shadow-gold-md
                  transition-all duration-250 ease-expo-out"
              >
                Ver Catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.orderCode}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      to={`/conta/pedidos/${order.orderCode}`}
                      className="flex items-center gap-4 glass rounded-xl p-5 border border-[var(--glass-border)]
                        hover:border-gold/25 transition-all duration-200 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-1.5">
                          <h3 className="font-display font-semibold text-foreground text-sm group-hover:text-gold transition-colors">
                            {order.orderCode}
                          </h3>
                          <span
                            className={cn(
                              "text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border",
                              getStatusColor(order.status),
                            )}
                          >
                            {statusLabel(order.status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground/50 font-body">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                          {order.itemsCount != null &&
                            ` · ${order.itemsCount} item${order.itemsCount !== 1 ? "s" : ""}`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-display text-lg font-bold text-gold">
                          {formatMoney(Number(order.total))}
                        </p>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 text-muted-foreground/30 group-hover:text-gold/50
                          transition-all duration-200 group-hover:translate-x-0.5 shrink-0"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                    className="glass rounded-lg px-4 py-2 text-sm font-body
                      text-muted-foreground/70 border border-[var(--glass-border)]
                      hover:border-gold/30 hover:text-gold
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--glass-border)] disabled:hover:text-muted-foreground/70
                      transition-all duration-200"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-body text-muted-foreground/70">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className="glass rounded-lg px-4 py-2 text-sm font-body
                      text-muted-foreground/70 border border-[var(--glass-border)]
                      hover:border-gold/30 hover:text-gold
                      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[var(--glass-border)] disabled:hover:text-muted-foreground/70
                      transition-all duration-200"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersList;
