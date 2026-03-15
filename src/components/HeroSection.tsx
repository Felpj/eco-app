import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Users, Star, ShieldCheck } from "lucide-react";
import heroImage from "@/assets/hero-perfume.jpg";

// ── Variantes de animação coreografadas ─────────────────────────────────────
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 28, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const imageVariant = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const trustBadges = [
  { icon: Users,      value: "500+",  label: "Clientes" },
  { icon: Truck,      value: "24h",   label: "Envio Rápido" },
  { icon: ShieldCheck,value: "100%",  label: "Autêntico" },
  { icon: Star,       value: "4.9★",  label: "Avaliação" },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* ── Aurora específica do hero (sobre os blobs globais) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="aurora-blob aurora-blob-lg absolute"
          style={{
            top: "5%", left: "5%",
            width: "700px", height: "700px",
            background: "var(--aurora-gold)",
            opacity: 0.8,
          }}
        />
        <div
          className="aurora-blob aurora-blob-lg absolute"
          style={{
            bottom: "0%", right: "-5%",
            width: "500px", height: "500px",
            background: "var(--aurora-amber)",
            opacity: 0.7,
            animationDelay: "3s",
          }}
        />
      </div>

      {/* ── Padrão de pontos (mais sutil) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, hsl(var(--gold)) 1px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── Conteúdo ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="text-center lg:text-left"
          >
            {/* Label / badge */}
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-2 mb-7">
                <Truck className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-xs font-body font-medium tracking-wide">
                  Envio em até 24h · Fragrâncias do Oriente Médio
                </span>
              </span>
            </motion.div>

            {/* Título */}
            <motion.h1
              variants={item}
              className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-5"
            >
              Perfumes Árabes de{" "}
              <span className="text-gradient-gold">Alta Fixação</span>{" "}
              <br className="hidden md:block" />
              com Alma de Luxo
            </motion.h1>

            {/* Citação editorial */}
            <motion.p variants={item} className="text-editorial text-scent text-lg mb-5 max-w-md mx-auto lg:mx-0">
              "Fragrâncias que contam histórias do Oriente — a um preço que o Brasil merece."
            </motion.p>

            {/* Descrição */}
            <motion.p variants={item} className="font-body text-base text-muted-foreground mb-9 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Inspirados nas melhores fragrâncias de nicho de até R$&thinsp;2.000.
              Intensidade e elegância que duram o dia todo.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12"
            >
              <Link
                to="/catalogo"
                className="shine-effect group inline-flex items-center justify-center gap-2
                  bg-gradient-gold text-[#080808] font-body font-semibold
                  px-7 py-4 rounded-xl text-sm tracking-wide
                  hover:-translate-y-0.5 hover:shadow-gold-md
                  transition-all duration-250 ease-expo-out"
              >
                Explorar Catálogo
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                to="/sobre"
                className="inline-flex items-center justify-center gap-2
                  glass border border-[rgba(201,168,76,0.25)] text-gold
                  font-body font-medium px-7 py-4 rounded-xl text-sm
                  hover:border-[rgba(201,168,76,0.5)] hover:bg-[rgba(201,168,76,0.06)]
                  transition-all duration-250 ease-expo-out"
              >
                Nossa História
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={item}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              {trustBadges.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="glass rounded-xl px-4 py-3 flex flex-col items-center min-w-[80px]"
                >
                  <Icon className="w-4 h-4 text-gold mb-1" />
                  <span className="font-display text-base font-bold text-gold leading-none">{value}</span>
                  <span className="text-[10px] text-muted-foreground font-body mt-0.5 uppercase tracking-wide">{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Imagem do produto ── */}
          <motion.div
            variants={imageVariant}
            initial="hidden"
            animate="show"
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glow atrás */}
              <div
                className="absolute inset-[-10%] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%)" }}
                aria-hidden="true"
              />

              {/* Frame glass */}
              <motion.div
                animate={{ y: [-8, 4, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full h-full glass-gold rounded-3xl overflow-hidden"
              >
                <img
                  src={heroImage}
                  alt="Perfume árabe de luxo — ESSENCE Árabe"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Floating card — desconto */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-3 -right-6 z-20 glass-gold rounded-2xl px-4 py-3 shadow-gold-md"
              >
                <span className="font-display font-bold text-xl text-gold leading-none block">-82%</span>
                <span className="text-muted-foreground text-[11px] font-body">vs original</span>
              </motion.div>

              {/* Floating card — avaliação */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-3 -left-6 z-20 glass rounded-2xl px-4 py-3"
              >
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-muted-foreground text-[11px] font-body">4.9 · 2.800+ avaliações</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[10px] text-muted-foreground/50 font-body uppercase tracking-widest">Rolar</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-gold/40 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
