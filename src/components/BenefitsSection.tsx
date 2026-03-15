import { motion } from "framer-motion";
import { Clock, Sparkles, Wallet, Truck } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Alta Fixação",
    description: "Mais de 12 horas de duração na pele. Fragrâncias que acompanham você o dia todo.",
  },
  {
    icon: Sparkles,
    title: "Intensidade Marcante",
    description: "Perfumes concentrados com projeção impressionante. Receba elogios por onde passar.",
  },
  {
    icon: Wallet,
    title: "Custo-Benefício",
    description: "Fragrâncias premium por uma fração do preço. Luxo genuíno e acessível.",
  },
  {
    icon: Truck,
    title: "Envio Rápido",
    description: "Compras até as 12h saem no mesmo dia. Entrega expressa para todo o Brasil.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const BenefitsSection = () => {
  return (
    <section className="py-24 bg-[#0d0d0d] relative overflow-hidden">
      {/* Linha ornamental de separação com seção anterior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />

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
              Diferenciais
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher nossos{" "}
            <span className="text-gradient-gold">perfumes</span>?
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto leading-relaxed">
            Qualidade excepcional que você sente desde a primeira borrifada
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit, i) => (
            <motion.article
              key={benefit.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="group glass rounded-2xl p-6 cursor-default
                hover:-translate-y-1.5 hover:border-[rgba(201,168,76,0.2)]
                hover:shadow-gold-sm transition-all duration-300 ease-expo-out"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/15
                flex items-center justify-center mb-5
                group-hover:bg-gold/15 group-hover:border-gold/25
                transition-all duration-300">
                <benefit.icon className="w-6 h-6 text-gold" />
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {benefit.description}
              </p>

              {/* Linha decorativa inferior */}
              <div className="mt-5 h-[1px] w-0 bg-gradient-to-r from-gold/40 to-transparent
                group-hover:w-full transition-all duration-500 ease-expo-out" />
            </motion.article>
          ))}
        </div>
      </div>

      {/* Linha ornamental inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />
    </section>
  );
};

export default BenefitsSection;
