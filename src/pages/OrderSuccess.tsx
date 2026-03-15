import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, MessageCircle, ShoppingBag, ArrowRight, Truck, Mail } from "lucide-react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { PostPurchaseOfferModal } from "@/components/upsell/PostPurchaseOfferModal";
import { getEligibleOffers } from "@/data/upsellOffers";
import { useCartStore } from "@/store/cart.store";

function generateOrderCode(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `EA-${year}${month}${day}-${random}`;
}

// Partícula dourada
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  angle: number;
  distance: number;
}

const GoldParticles = ({ trigger }: { trigger: boolean }) => {
  const particles: Particle[] = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 50 + Math.cos((i / 18) * Math.PI * 2) * 5,
    y: 50 + Math.sin((i / 18) * Math.PI * 2) * 5,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 0.8 + 0.6,
    delay: Math.random() * 0.3,
    angle: (i / 18) * 360,
    distance: Math.random() * 80 + 40,
  }));

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

const timelineSteps = [
  {
    icon: CheckCircle,
    label: "Pedido confirmado",
    description: "Recebemos seu pedido com sucesso",
    done: true,
  },
  {
    icon: Mail,
    label: "Email de confirmação",
    description: "Enviado para o seu endereço cadastrado",
    done: true,
  },
  {
    icon: Package,
    label: "Preparando envio",
    description: "Será embalado com cuidado em até 24h",
    done: false,
  },
  {
    icon: Truck,
    label: "Enviado para entrega",
    description: "Você recebe o código de rastreio por WhatsApp",
    done: false,
  },
];

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { getSubtotal } = useCartStore();
  const orderCode = orderId || generateOrderCode();
  const [showPostPurchaseOffer, setShowPostPurchaseOffer] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(false);

  const postPurchaseOffers = getEligibleOffers("THANK_YOU", getSubtotal(), []).filter(
    (o) => o.type === "POST_PURCHASE"
  );
  const postPurchaseOffer = postPurchaseOffers[0] || null;

  useEffect(() => {
    const pTimer = setTimeout(() => setParticleTrigger(true), 400);
    return () => clearTimeout(pTimer);
  }, []);

  useEffect(() => {
    if (postPurchaseOffer) {
      const timer = setTimeout(() => setShowPostPurchaseOffer(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [postPurchaseOffer]);

  const whatsappMessage = `Oi! Meu pedido ${orderCode} foi confirmado. Pode me atualizar o status?`;
  const whatsappUrl = `https://wa.me/5518996718769?text=${encodeURIComponent(whatsappMessage)}`;

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Check icon com spring + partículas */}
            <motion.div
              variants={itemVariants}
              className="relative mb-8"
            >
              <div className="relative w-28 h-28">
                {/* Glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Icon circle */}
                <motion.div
                  className="absolute inset-0 rounded-full glass-gold flex items-center justify-center border border-gold/40"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.2 }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 300, delay: 0.45 }}
                  >
                    <CheckCircle className="w-12 h-12 text-gold" />
                  </motion.div>
                </motion.div>
                {/* Particles */}
                <GoldParticles trigger={particleTrigger} />
              </div>
            </motion.div>

            {/* Título */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">
                Pedido Confirmado!
              </h1>
              <p className="text-muted-foreground font-body mb-3">
                Obrigado pela sua compra na ESSENCE Árabe
              </p>
              <div className="inline-flex items-center gap-2 glass-gold rounded-xl px-5 py-2.5 border border-gold/30">
                <span className="text-muted-foreground font-body text-sm">Pedido:</span>
                <span className="text-gold font-display font-bold tracking-wider">{orderCode}</span>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={itemVariants} className="w-full glass rounded-2xl p-6 mb-6">
              <h3 className="font-display font-semibold text-foreground text-sm uppercase tracking-widest mb-5 text-center">
                Acompanhamento do Pedido
              </h3>
              <div className="space-y-0">
                {timelineSteps.map((step, i) => {
                  const Icon = step.icon;
                  const isLast = i === timelineSteps.length - 1;
                  return (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-4"
                    >
                      {/* Icon + line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-300 ${
                            step.done
                              ? "bg-gold/15 border-gold/40"
                              : "bg-[#111] border-[var(--glass-border)]"
                          }`}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 ${step.done ? "text-gold" : "text-muted-foreground/40"}`}
                          />
                        </div>
                        {!isLast && (
                          <div className="w-px flex-1 my-1.5 bg-gradient-to-b from-gold/30 to-transparent" />
                        )}
                      </div>
                      {/* Text */}
                      <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                        <p className={`font-body font-semibold text-sm ${step.done ? "text-foreground" : "text-muted-foreground/50"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground/60 font-body mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Info card */}
            <motion.div variants={itemVariants} className="w-full glass rounded-2xl p-6 mb-8">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-gold" />
                Próximos passos
              </h3>
              <ul className="space-y-3">
                {[
                  "Aguarde a confirmação do pagamento (PIX: imediato | Cartão: até 2 dias úteis)",
                  "Você receberá o código de rastreamento por email e WhatsApp",
                  `Acompanhe seu pedido através do número ${orderCode}`,
                ].map((text, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 text-sm font-body text-muted-foreground"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/70 mt-1.5 shrink-0" />
                    {text}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="w-full flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 shine-effect group bg-gradient-gold text-[#080808]
                  font-body font-bold py-4 rounded-xl text-sm tracking-wide
                  flex items-center justify-center gap-2
                  hover:-translate-y-0.5 hover:shadow-gold-md
                  transition-all duration-250 ease-expo-out"
              >
                <MessageCircle className="w-4 h-4" />
                Acompanhar pelo WhatsApp
              </a>
              <Link
                to="/catalogo"
                className="flex-1 group glass rounded-xl py-4 text-sm font-body font-semibold
                  text-foreground border border-[var(--glass-border)]
                  flex items-center justify-center gap-2
                  hover:border-gold/30 hover:text-gold
                  transition-all duration-200"
              >
                <ShoppingBag className="w-4 h-4" />
                Continuar Comprando
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Editorial quote */}
            <motion.p
              variants={itemVariants}
              className="text-center text-sm text-muted-foreground/40 font-editorial italic mt-10"
            >
              "O aroma que você escolheu será a sua assinatura invisível."
            </motion.p>
          </motion.div>
        </div>
      </main>

      {postPurchaseOffer && (
        <PostPurchaseOfferModal
          offer={postPurchaseOffer}
          orderCode={orderCode}
          isOpen={showPostPurchaseOffer}
          onClose={() => setShowPostPurchaseOffer(false)}
        />
      )}
    </div>
  );
};

export default OrderSuccess;
