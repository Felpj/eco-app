import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Package,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getOrderByCode,
  type OrderDetailResponse,
  type OrderStatus,
  type CreateOrderResponse,
} from "@/lib/api";
import { pixQrImageSrc } from "@/lib/pix";

// Estado vindo via navigate state do Checkout (slice 2). Pode não estar presente
// se o usuário recarregar a página — nesse caso só GET /orders/:orderCode.
type LocationStateOrder = Partial<CreateOrderResponse> | undefined;

interface Particle {
  id: number;
  size: number;
  duration: number;
  delay: number;
  angle: number;
  distance: number;
}

const GoldParticles = ({ trigger }: { trigger: boolean }) => {
  const particles: Particle[] = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 0.8 + 0.6,
        delay: Math.random() * 0.3,
        angle: (i / 18) * 360,
        distance: Math.random() * 80 + 40,
      })),
    [],
  );

  if (!trigger) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold"
          style={{
            width: p.size,
            height: p.size,
            left: "50%",
            top: "50%",
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          animate={{
            opacity: 0,
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            scale: 0,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  );
};

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000; // 10 min
const DEFAULT_PIX_TTL_MS = 30 * 60 * 1000; // 30 min fallback se backend não devolver expiresAt
const TERMINAL_STATUSES: ReadonlySet<OrderStatus> = new Set([
  "PAID",
  "FULFILLING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

function formatBRL(v: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

const OrderSuccess = () => {
  const { orderId } = useParams();
  const orderCode = orderId ?? "";
  const location = useLocation();
  const initialOrder = (location.state as { order?: LocationStateOrder } | null)?.order ?? null;

  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  // A imagem do QR (base64/data-URI) e o copia-e-cola EMV vêm em campos
  // separados do back — não colapsar num só (a imagem NÃO serve pra copiar,
  // o EMV NÃO serve como <img src>).
  const [pixImage, setPixImage] = useState<string | null>(
    initialOrder?.pixQrCode ?? null,
  );
  const [pixCopiaECola, setPixCopiaECola] = useState<string | null>(
    initialOrder?.paymentString ?? null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);

  // Fonte de pixExpiresAt: location.state.order.pixExpiresAt (se veio do checkout)
  // ou fallback derivado de agora + 30min.
  const pixExpiresAtMs = useMemo(() => {
    const stateExpires = initialOrder?.pixExpiresAt;
    if (stateExpires) {
      const t = Date.parse(stateExpires);
      if (!Number.isNaN(t)) return t;
    }
    return Date.now() + DEFAULT_PIX_TTL_MS;
    // Trava na primeira render — não recomputa em cada tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [now, setNow] = useState<number>(() => Date.now());

  const pollStartRef = useRef<number>(Date.now());
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clockTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch helper — atualiza order; também extrai pixQrCode dos payments PENDING.
  const fetchOrder = useCallback(async () => {
    if (!orderCode) return null;
    const fresh = await getOrderByCode(orderCode);
    setOrder(fresh);
    const pendingPix = fresh.payments.find(
      (p) => p.method === "PIX" && p.status === "PENDING",
    );
    // Só sobrescreve quando o GET traz o campo — não apaga o valor que veio do
    // navigate state se um refresh de polling vier sem os dados PIX.
    if (pendingPix?.pixQrCode) setPixImage(pendingPix.pixQrCode);
    if (pendingPix?.paymentString) setPixCopiaECola(pendingPix.paymentString);
    return fresh;
  }, [orderCode]);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    if (!orderCode) {
      setLoading(false);
      setError("Código do pedido ausente.");
      return;
    }
    (async () => {
      try {
        const fresh = await fetchOrder();
        if (cancelled) return;
        if (!fresh) return;
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar pedido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderCode, fetchOrder]);

  // Polling de status
  useEffect(() => {
    if (!orderCode) return;
    if (!order) return;
    if (TERMINAL_STATUSES.has(order.status)) return;
    if (pollTimedOut) return;

    pollTimerRef.current = setInterval(async () => {
      const elapsed = Date.now() - pollStartRef.current;
      if (elapsed >= POLL_TIMEOUT_MS) {
        setPollTimedOut(true);
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        return;
      }
      try {
        await fetchOrder();
      } catch {
        // silent — próximo tick tenta de novo
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [orderCode, order, fetchOrder, pollTimedOut]);

  // Relógio para countdown
  useEffect(() => {
    clockTimerRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (clockTimerRef.current) {
        clearInterval(clockTimerRef.current);
        clockTimerRef.current = null;
      }
    };
  }, []);

  // Partículas ao confirmar pagamento
  useEffect(() => {
    if (
      order?.status === "PAID" ||
      order?.status === "FULFILLING" ||
      order?.status === "SHIPPED" ||
      order?.status === "DELIVERED"
    ) {
      const t = setTimeout(() => setParticleTrigger(true), 250);
      return () => clearTimeout(t);
    }
  }, [order?.status]);

  const status: OrderStatus | null = order?.status ?? null;
  const isPaid =
    status === "PAID" ||
    status === "FULFILLING" ||
    status === "SHIPPED" ||
    status === "DELIVERED";
  // O back não tem status "PENDING" nem "EXPIRED": PIX aguardando = PENDING_PAYMENT;
  // expiração é derivada do tempo (pixExpiredByTime/pollTimedOut), não de enum.
  const isPending = status === "PENDING_PAYMENT";
  const isCancelled = status === "CANCELLED" || status === "REFUNDED";

  const msLeft = pixExpiresAtMs - now;
  const pixExpiredByTime = msLeft <= 0;
  const pixImageSrc = pixQrImageSrc(pixImage, pixCopiaECola);

  const handleCopyPix = async () => {
    if (!pixCopiaECola) return;
    try {
      await navigator.clipboard.writeText(pixCopiaECola);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback noop
    }
  };

  const whatsappMessage = `Oi! Meu pedido ${orderCode} foi confirmado. Pode me atualizar o status?`;
  const whatsappUrl = `https://wa.me/5518996718769?text=${encodeURIComponent(whatsappMessage)}`;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="aurora-blob"
          style={{ width: 500, height: 500, left: "20%", top: "10%", background: "var(--aurora-gold)" }}
        />
        <div
          className="aurora-blob"
          style={{ width: 400, height: 400, right: "15%", bottom: "20%", background: "var(--aurora-amber)", animationDelay: "-3s" }}
        />
      </div>

      <main className="relative pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
              <p className="mt-4 text-sm font-body text-muted-foreground">
                Carregando seu pedido...
              </p>
            </div>
          ) : error ? (
            <div className="glass rounded-2xl p-8 text-center">
              <AlertTriangle className="w-10 h-10 text-gold mx-auto mb-3" />
              <h2 className="font-display text-xl text-foreground mb-2">
                Não conseguimos carregar o pedido
              </h2>
              <p className="text-sm font-body text-muted-foreground mb-5">{error}</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 glass-gold px-5 py-2.5 rounded-xl border border-gold/30 text-gold font-body text-sm"
              >
                <ArrowRight className="w-4 h-4" />
                Voltar à loja
              </Link>
            </div>
          ) : !order ? null : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              {/* HEADER por status */}
              <AnimatePresence mode="wait">
                {isPaid ? (
                  <motion.div
                    key="paid"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative mb-8"
                  >
                    <div className="relative w-28 h-28">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)",
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.8, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full glass-gold flex items-center justify-center border border-gold/40"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
                      >
                        <CheckCircle className="w-12 h-12 text-gold" />
                      </motion.div>
                      <GoldParticles trigger={particleTrigger} />
                    </div>
                  </motion.div>
                ) : isCancelled || pollTimedOut || pixExpiredByTime ? (
                  <motion.div
                    key="failed"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative mb-8"
                  >
                    <div className="relative w-24 h-24 rounded-full glass flex items-center justify-center border border-[var(--glass-border)]">
                      <XCircle className="w-11 h-11 text-muted-foreground" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="pending"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative mb-8"
                  >
                    <div className="relative w-24 h-24 rounded-full glass-gold flex items-center justify-center border border-gold/30">
                      <Clock className="w-11 h-11 text-gold" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Título por status */}
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
                  {isPaid
                    ? "Pedido Confirmado!"
                    : isCancelled
                    ? "Pedido cancelado"
                    : pollTimedOut || pixExpiredByTime
                    ? "Pedido expirou"
                    : "Aguardando pagamento"}
                </h1>
                <p className="text-muted-foreground font-body mb-3">
                  {isPaid
                    ? "Obrigado pela sua compra na ESSENCE Árabe"
                    : isCancelled
                    ? "Este pedido não está mais ativo."
                    : pollTimedOut || pixExpiredByTime
                    ? "O tempo para pagamento esgotou — gere um novo pedido."
                    : "Pague com PIX para confirmar seu pedido."}
                </p>
                <div className="inline-flex items-center gap-2 glass-gold rounded-xl px-5 py-2.5 border border-gold/30">
                  <span className="text-muted-foreground font-body text-sm">Pedido:</span>
                  <span className="text-gold font-display font-bold tracking-wider">
                    {order.orderCode}
                  </span>
                </div>
              </motion.div>

              {/* PIX block — só enquanto PENDING_PAYMENT e não expirou */}
              {isPending && !pixExpiredByTime && !pollTimedOut && pixImageSrc && (
                <motion.div variants={itemVariants} className="w-full glass rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-widest">
                      Pague via PIX
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      Expira em{" "}
                      <span className="text-gold font-semibold tabular-nums">
                        {formatCountdown(msLeft)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="bg-white p-3 rounded-xl mb-4">
                      {/* A imagem do QR já vem pronta do provider (MP: base64
                          de PNG; TCR: data-URI) — renderiza direto, sem CDN de
                          terceiro. Fallback (só EMV) monta via qrserver dentro
                          de pixQrImageSrc. */}
                      <img
                        src={pixImageSrc}
                        alt="QR Code PIX"
                        width={260}
                        height={260}
                        className="block"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full max-w-sm shine-effect group bg-gradient-gold text-[#080808]
                        font-body font-bold py-3.5 rounded-xl text-sm tracking-wide
                        flex items-center justify-center gap-2
                        hover:-translate-y-0.5 hover:shadow-gold-md
                        transition-all duration-250 ease-expo-out"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Código copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar código PIX
                        </>
                      )}
                    </button>

                    <p className="text-xs font-body text-muted-foreground/60 mt-3 text-center max-w-sm">
                      Após pagar no seu app do banco, esta página atualiza automaticamente em
                      poucos segundos.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Mensagens de polling timeout / expiração visual quando ainda PENDING */}
              {isPending && (pollTimedOut || pixExpiredByTime) && (
                <motion.div variants={itemVariants} className="w-full glass rounded-2xl p-6 mb-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-gold mx-auto mb-2" />
                  <p className="font-body text-sm text-foreground mb-2">
                    {pixExpiredByTime
                      ? "O código PIX expirou."
                      : "Não detectamos o pagamento neste tempo."}
                  </p>
                  <p className="text-xs font-body text-muted-foreground/70 mb-4">
                    Tente gerar um novo pedido. Se você já pagou, fale com a gente pelo WhatsApp.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 glass-gold rounded-xl px-5 py-2.5 border border-gold/30 text-gold font-body text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Voltar à loja
                  </Link>
                </motion.div>
              )}

              {/* Resumo do pedido */}
              <motion.div variants={itemVariants} className="w-full glass rounded-2xl p-6 mb-6">
                <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-gold" />
                  Resumo do pedido
                </h3>
                <ul className="space-y-3 mb-4">
                  {order.items.map((it) => (
                    <li
                      key={it.productId}
                      className="flex items-center gap-3 text-sm font-body text-foreground"
                    >
                      {it.image ? (
                        <img
                          src={it.image}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-[#111] border border-[var(--glass-border)]"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-[#111] border border-[var(--glass-border)]" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate">{it.name}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {it.quantity} × {formatBRL(it.unitPrice)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatBRL(it.totalPrice)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-[var(--glass-border)] space-y-1.5">
                  <Row label="Subtotal" value={formatBRL(order.subtotal)} muted />
                  {order.discount > 0 && (
                    <Row label="Desconto" value={`- ${formatBRL(order.discount)}`} muted />
                  )}
                  <Row label="Frete" value={formatBRL(order.shippingCost)} muted />
                  <div className="pt-2 mt-2 border-t border-[var(--glass-border)] flex items-baseline justify-between">
                    <span className="font-display font-semibold text-foreground">Total</span>
                    <span className="font-display font-bold text-lg text-gold tabular-nums">
                      {formatBRL(order.total)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="w-full flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 group glass rounded-xl py-4 text-sm font-body font-semibold
                    text-foreground border border-[var(--glass-border)]
                    flex items-center justify-center gap-2
                    hover:border-gold/30 hover:text-gold
                    transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
                <Link
                  to="/"
                  className={`flex-1 group rounded-xl py-4 text-sm font-body font-semibold
                    flex items-center justify-center gap-2 transition-all duration-200
                    ${
                      isPaid
                        ? "shine-effect bg-gradient-gold text-[#080808] hover:-translate-y-0.5 hover:shadow-gold-md"
                        : "glass border border-[var(--glass-border)] text-foreground hover:border-gold/30 hover:text-gold"
                    }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Voltar à loja
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-center text-sm text-muted-foreground/40 font-editorial italic mt-10"
              >
                "O aroma que você escolheu será a sua assinatura invisível."
              </motion.p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

const Row = ({ label, value, muted }: { label: string; value: string; muted?: boolean }) => (
  <div className="flex items-baseline justify-between text-sm font-body">
    <span className={muted ? "text-muted-foreground" : "text-foreground"}>{label}</span>
    <span className="tabular-nums text-foreground">{value}</span>
  </div>
);

export default OrderSuccess;
