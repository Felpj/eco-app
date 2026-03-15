import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Package, Truck, CheckCircle } from "lucide-react";
import { useCustomerStore } from "@/store/customer.store";
import { formatMoney } from "@/lib/money";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "CONFIRMADO": return "bg-blue-500/15 text-blue-400 border-blue-500/25";
    case "EM_SEPARACAO": return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25";
    case "ENVIADO": return "bg-purple-500/15 text-purple-400 border-purple-500/25";
    case "ENTREGUE": return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "CANCELADO": return "bg-red-500/15 text-red-400 border-red-500/25";
    default: return "bg-[#111] text-muted-foreground border-[var(--glass-border)]";
  }
};

const OrderDetails = () => {
  const { orderCode } = useParams();
  const { orders } = useCustomerStore();
  const order = orders.find((o) => o.orderCode === orderCode);

  if (!order) {
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

  const timelineSteps = [
    { status: "CONFIRMADO" as const, label: "Pedido Confirmado", icon: CheckCircle, completed: true },
    { status: "EM_SEPARACAO" as const, label: "Em Separação", icon: Package, completed: ["EM_SEPARACAO", "ENVIADO", "ENTREGUE"].includes(order.status) },
    { status: "ENVIADO" as const, label: "Enviado", icon: Truck, completed: ["ENVIADO", "ENTREGUE"].includes(order.status) },
    { status: "ENTREGUE" as const, label: "Entregue", icon: CheckCircle, completed: order.status === "ENTREGUE" },
  ];

  const currentStepIndex = timelineSteps.findIndex((s) => s.status === order.status);

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

          {/* Header */}
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
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </p>
            </div>
            <span className={cn(
              "self-start text-sm font-body font-semibold px-4 py-1.5 rounded-full border",
              getStatusColor(order.status)
            )}>
              {order.status.replace("_", " ")}
            </span>
          </motion.div>

          <div className="space-y-5">
            {/* Timeline */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-base font-semibold text-foreground mb-5">
                Acompanhamento
              </h2>
              <div className="space-y-0">
                {timelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isCurrent = i === currentStepIndex;
                  const isLast = i === timelineSteps.length - 1;
                  return (
                    <motion.div
                      key={step.status}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border shrink-0",
                          step.completed ? "bg-gold/15 border-gold/40" : "bg-[#111] border-[var(--glass-border)]",
                          isCurrent && !step.completed ? "border-gold/30 bg-gold/5" : ""
                        )}>
                          <Icon className={cn("w-3.5 h-3.5", step.completed ? "text-gold" : "text-muted-foreground/30")} />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 my-1.5 bg-gradient-to-b from-gold/30 to-transparent" />
                        )}
                      </div>
                      <div className={`${isLast ? "pb-0" : "pb-5"}`}>
                        <p className={cn(
                          "font-body font-semibold text-sm",
                          step.completed ? "text-foreground" : "text-muted-foreground/40"
                        )}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-gold/70 font-body mt-0.5">Status atual</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="glass rounded-2xl p-6">
              <h2 className="font-display text-base font-semibold text-foreground mb-5">
                Itens do Pedido
              </h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-[var(--bg-elevated)] rounded-xl">
                    {item.image && (
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#111] shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-foreground text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground/60 font-body">Qtd: {item.qty}</p>
                    </div>
                    <p className="font-display font-bold text-gold text-sm shrink-0">
                      {formatMoney(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {order.contact && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                    Dados de Contato
                  </h3>
                  <div className="space-y-1 text-xs font-body text-muted-foreground/70">
                    <p><span className="text-foreground/60">Nome:</span> {order.contact.fullName}</p>
                    <p><span className="text-foreground/60">WhatsApp:</span> {order.contact.whatsapp}</p>
                    {order.contact.email && <p><span className="text-foreground/60">Email:</span> {order.contact.email}</p>}
                  </div>
                </div>
              )}
              {order.delivery && (
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                    Endereço de Entrega
                  </h3>
                  <div className="space-y-1 text-xs font-body text-muted-foreground/70">
                    <p>{order.delivery.addressLine1}{order.delivery.addressLine2 && ` - ${order.delivery.addressLine2}`}</p>
                    <p>{order.delivery.neighborhood}, {order.delivery.city} - {order.delivery.state}</p>
                    <p>CEP: {order.delivery.cep}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking */}
            {order.tracking && (
              <div className="glass rounded-2xl p-5">
                <h3 className="font-display text-sm font-semibold text-foreground mb-3">
                  Rastreamento
                </h3>
                <div className="space-y-1 text-xs font-body text-muted-foreground/70">
                  {order.tracking.carrier && <p><span className="text-foreground/60">Transportadora:</span> {order.tracking.carrier}</p>}
                  {order.tracking.code && <p><span className="text-foreground/60">Código:</span> {order.tracking.code}</p>}
                  {order.tracking.url && (
                    <a
                      href={order.tracking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold/80 hover:text-gold transition-colors mt-2"
                    >
                      Rastrear pedido →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="glass-gold rounded-2xl p-5 border border-gold/20 flex justify-between items-center">
              <span className="font-display font-semibold text-foreground">Total do Pedido</span>
              <span className="font-display text-2xl font-bold text-gold">{formatMoney(order.total)}</span>
            </div>

            {/* Actions */}
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
