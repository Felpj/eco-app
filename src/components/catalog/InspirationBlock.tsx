import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { getInspirationMeta } from "@/data/inspirationData";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/data/products";

interface InspirationBlockProps {
  product: Product;
}

export function InspirationBlock({ product }: InspirationBlockProps) {
  const inspiredBy = product.inspired_by;
  if (!inspiredBy?.trim()) return null;

  const meta = getInspirationMeta(inspiredBy);
  const accords = meta?.accords ?? ["Assinatura", "Premium"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative overflow-hidden"
    >
      {/* Glow de fundo */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative glass-gold rounded-2xl border border-gold/20 p-6 md:p-8
        shadow-[0_0_60px_-15px_rgba(201,168,76,0.15)]
        hover:border-gold/30 transition-all duration-300">
        {/* Label superior */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-gold" aria-hidden />
          <span className="text-[10px] text-gold/90 uppercase tracking-[0.25em] font-body font-semibold">
            Espelho de Luxo
          </span>
        </div>

        {/* Headline principal */}
        <p className="text-muted-foreground font-body text-sm mb-1">
          Inspirado em
        </p>
        <h2 className="font-display text-2xl md:text-4xl font-bold leading-tight mb-2">
          <span className="text-gradient-gold inline-block">{inspiredBy}</span>
        </h2>
        {meta?.tagline && (
          <p className="text-editorial text-gold/80 text-base md:text-lg mb-5">
            {meta.tagline}
          </p>
        )}

        {/* Comparativo de preço */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          {meta?.priceEstimate && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-body line-through">
                Original {meta.priceEstimate}
              </span>
              <ArrowRight className="w-4 h-4 text-gold/60" aria-hidden />
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-gold font-body font-bold text-lg">
              Nosso: {formatMoney(product.price_brl)}
            </span>
            <span className="text-emerald-400/90 text-xs font-body font-medium px-2 py-0.5 rounded-full bg-emerald-500/10">
              até 90% mais barato
            </span>
          </div>
        </div>

        {/* Acordes */}
        <div className="flex flex-wrap gap-2 mb-4">
          {accords.map((accord) => (
            <span
              key={accord}
              className="px-3 py-1.5 rounded-lg text-xs font-body font-medium
                bg-white/5 border border-white/10 text-muted-foreground
                hover:border-gold/20 hover:text-gold/90 transition-colors duration-200"
            >
              {accord}
            </span>
          ))}
        </div>

        {/* Tagline de valor */}
        <p className="text-muted-foreground/80 text-sm font-body">
          Mesma assinatura olfativa. Concentração árabe. Preço acessível.
        </p>

        {/* Disclaimer (compliance) */}
        <p className="mt-4 pt-4 border-t border-white/5 text-[10px] text-muted-foreground/60 font-body leading-relaxed">
          Inspiração olfativa. Não somos afiliados às marcas citadas.
        </p>
      </div>
    </motion.div>
  );
}
