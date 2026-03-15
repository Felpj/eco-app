import { motion, AnimatePresence } from "framer-motion";
import { Truck, PartyPopper } from "lucide-react";
import { upsellConfig } from "@/data/upsellOffers";
import { formatMoney } from "@/lib/money";

interface FreeShippingProgressProps {
  cartTotal: number;
}

export const FreeShippingProgress = ({ cartTotal }: FreeShippingProgressProps) => {
  const threshold = upsellConfig.freeShippingThreshold;
  const remaining = Math.max(0, threshold - cartTotal);
  const progress = Math.min(100, (cartTotal / threshold) * 100);
  const hasFreeShipping = cartTotal >= threshold;

  return (
    <AnimatePresence mode="wait">
      {hasFreeShipping ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-xl p-4 border border-emerald-500/25 bg-emerald-500/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30
              flex items-center justify-center shrink-0">
              <PartyPopper className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-body font-semibold text-emerald-400">
                Frete grátis conquistado!
              </p>
              <p className="text-xs text-muted-foreground font-body">
                Seu pedido chega sem custo de entrega
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="progress"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-gold shrink-0" />
            <p className="text-sm font-body text-foreground">
              Faltam{" "}
              <span className="text-gold font-semibold">{formatMoney(remaining)}</span>
              {" "}para frete grátis
            </p>
          </div>

          {/* Barra de progresso custom */}
          <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full"
            />
          </div>

          <p className="text-xs text-muted-foreground/60 font-body mt-2">
            Frete grátis em compras acima de {formatMoney(threshold)}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
