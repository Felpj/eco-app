import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Package, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomerStore } from "@/store/customer.store";
import { OrderStatus } from "@/types/account";
import { formatMoney } from "@/lib/money";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "EM_SEPARACAO", label: "Em Separação" },
  { value: "ENVIADO", label: "Enviado" },
  { value: "ENTREGUE", label: "Entregue" },
  { value: "CANCELADO", label: "Cancelado" },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "CONFIRMADO": return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "EM_SEPARACAO": return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    case "ENVIADO": return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    case "ENTREGUE": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "CANCELADO": return "bg-red-500/15 text-red-400 border-red-500/25";
    default: return "bg-[#111] text-muted-foreground border-[var(--glass-border)]";
  }
};

const OrdersList = () => {
  const { orders } = useCustomerStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderCode.toLowerCase().includes(q) ||
          o.items.some((item) => item.name.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, search, statusFilter]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <Link
            to="/conta"
            className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
              transition-colors duration-200 mb-8 font-body text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Voltar para conta
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Meus Pedidos
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por código ou produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass rounded-xl pl-10 pr-4 py-2.5 text-sm font-body text-foreground
                  placeholder:text-muted-foreground/40
                  focus:border-gold/30 focus:ring-2 focus:ring-gold/10 focus:outline-none
                  transition-all duration-200"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px] glass rounded-xl border-[var(--glass-border)] text-sm font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass rounded-xl border-[var(--glass-border)]">
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="font-body text-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass border border-[var(--glass-border)]
                flex items-center justify-center">
                <Package className="w-9 h-9 text-muted-foreground/30" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                {orders.length === 0 ? "Você ainda não tem pedidos" : "Nenhum pedido encontrado"}
              </h2>
              <p className="text-muted-foreground/60 font-body text-sm mb-8">
                {orders.length === 0
                  ? "Que tal explorar nosso catálogo e fazer sua primeira compra?"
                  : "Tente ajustar os filtros de busca."}
              </p>
              {orders.length === 0 && (
                <Link
                  to="/catalogo"
                  className="inline-flex items-center gap-2 shine-effect bg-gradient-gold text-[#080808]
                    font-body font-bold py-3 px-6 rounded-xl text-sm
                    hover:-translate-y-0.5 hover:shadow-gold-md
                    transition-all duration-250 ease-expo-out"
                >
                  Ver Catálogo
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.orderCode}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                        <span className={cn("text-[10px] font-body font-semibold px-2 py-0.5 rounded-full border", getStatusColor(order.status))}>
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground/50 font-body">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                        {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-lg font-bold text-gold">
                        {formatMoney(order.total)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-gold/50
                      transition-all duration-200 group-hover:translate-x-0.5 shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrdersList;
