import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, ArrowRight, Check } from "lucide-react";
import featuredProductImage from "@/assets/featured-product.jpg";

const features = [
  "Inspirado em Sauvage Elixir (Dior)",
  "Fixação de até 14 horas na pele",
  "Projeção moderada a forte",
  "Ideal para todas as ocasiões",
];

const scentNotes = [
  { layer: "Topo",    note: "Bergamota" },
  { layer: "Coração", note: "Oud & Lavanda" },
  { layer: "Fundo",   note: "Âmbar & Baunilha" },
];

const FeaturedProduct = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="ornament-line mb-4">
            <span className="text-gold/60 text-[10px] uppercase tracking-[0.3em] font-body px-3">
              Destaque da Coleção
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Perfume Carro-Chefe
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Imagem ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Glow cinematográfico */}
              <div
                className="absolute inset-[-15%] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)" }}
                aria-hidden="true"
              />

              {/* Frame glass-gold */}
              <div className="relative z-10 w-full h-full glass-gold rounded-3xl overflow-hidden
                transition-all duration-500 hover:shadow-gold-md">
                <img
                  src={featuredProductImage}
                  alt="Blue Intense — Perfume Destaque ESSENCE Árabe"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              {/* Badge "Mais Vendido" */}
              <div className="absolute top-4 right-4 z-20 bg-gradient-gold text-[#080808]
                px-3 py-1.5 rounded-full text-xs font-body font-bold tracking-wide
                animate-pulse-gold">
                Mais Vendido
              </div>
            </div>
          </motion.div>

          {/* ── Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 justify-center lg:justify-start mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
              <span className="text-muted-foreground text-sm font-body ml-2">
                (1.247 avaliações)
              </span>
            </div>

            {/* Nome */}
            <h3 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-1">
              BLUE INTENSE
            </h3>
            <p className="text-sm text-muted-foreground font-body uppercase tracking-widest mb-5">
              ARMAF · Club de Nuit
            </p>

            {/* Descrição editorial */}
            <p className="text-editorial text-scent text-base mb-6 max-w-sm mx-auto lg:mx-0">
              "Amadeirado fresco com alma árabe. Bergamota na abertura, oud no coração, âmbar na pele."
            </p>

            {/* Notas olfativas */}
            <div className="mb-7">
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.25em] font-body mb-3">
                Pirâmide Olfativa
              </p>
              <div className="grid grid-cols-3 gap-2">
                {scentNotes.map(({ layer, note }) => (
                  <div key={layer} className="glass rounded-xl p-3 text-center">
                    <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{layer}</p>
                    <p className="text-sm text-gold font-body font-medium mt-1">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-5 h-5 rounded-full bg-gold/15 border border-gold/25
                    flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-gold" />
                  </div>
                  <span className="text-foreground/90 font-body text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Preço */}
            <div className="glass rounded-2xl p-5 border border-[rgba(201,168,76,0.15)] mb-8">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-muted-foreground text-xs font-body block mb-0.5">
                    Inspiração Original
                  </span>
                  <span className="text-muted-foreground/60 line-through text-base font-body">
                    R$&thinsp;1.890,00
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gold/70 text-xs font-body block mb-0.5">Nosso Preço</span>
                  <span className="font-display text-4xl font-bold text-foreground leading-none">
                    R$&thinsp;349
                    <span className="text-xl text-muted-foreground font-light">,00</span>
                  </span>
                </div>
              </div>
              <div className="mt-4 bg-gold/8 border border-gold/15 rounded-lg px-4 py-2 text-center">
                <span className="text-gold text-sm font-body font-semibold">
                  Economia de R$&thinsp;1.541,00 · 82% OFF
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                to="/produto/1"
                className="shine-effect group inline-flex items-center justify-center gap-2
                  bg-gradient-gold text-[#080808] font-body font-semibold
                  px-7 py-4 rounded-xl text-sm tracking-wide
                  hover:-translate-y-0.5 hover:shadow-gold-md
                  transition-all duration-250 ease-expo-out"
              >
                Comprar Agora
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/produto/1"
                className="inline-flex items-center justify-center gap-2
                  glass border border-[rgba(201,168,76,0.25)] text-gold
                  font-body font-medium px-7 py-4 rounded-xl text-sm
                  hover:border-[rgba(201,168,76,0.5)] hover:bg-[rgba(201,168,76,0.06)]
                  transition-all duration-250 ease-expo-out"
              >
                Ver Detalhes
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
