import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Lucas M.",
    location: "São Paulo, SP",
    rating: 5,
    text: "Impressionante! A fixação é absurda, passo mais de 12 horas e ainda recebo elogios. Melhor custo-benefício que já encontrei.",
    product: "Blue Intense",
  },
  {
    name: "Carolina S.",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Já comprei 3 fragrâncias diferentes e todas são incríveis. A qualidade é de perfume de grife, mas por uma fração do preço.",
    product: "Rose Oud",
  },
  {
    name: "Pedro H.",
    location: "Curitiba, PR",
    rating: 5,
    text: "Cético no início, mas me surpreendi completamente. O envio foi super rápido e o perfume é exatamente como descrito. Virei cliente fiel.",
    product: "Amber Noir",
  },
  {
    name: "Juliana R.",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Meu marido não para de receber elogios desde que começou a usar. A projeção é incrível e dura o dia todo!",
    product: "Blue Intense",
  },
];

const stats = [
  { value: "2.847", label: "Avaliações" },
  { value: "4.9/5", label: "Nota Média" },
  { value: "98%",   label: "Satisfação" },
  { value: "15k+",  label: "Clientes" },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-[#0d0d0d] relative overflow-hidden">
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
              Prova Social
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            O que nossos clientes{" "}
            <span className="text-gradient-gold">dizem</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Mais de 2.800 avaliações 5 estrelas de clientes satisfeitos em todo o Brasil
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {testimonials.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-6 flex flex-col gap-4
                hover:-translate-y-1 hover:border-[rgba(255,255,255,0.12)]
                transition-all duration-300 ease-expo-out"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 fill-gold text-gold" />
                ))}
              </div>

              {/* Citação em Cormorant */}
              <blockquote className="text-editorial text-foreground/85 text-base leading-relaxed flex-1">
                "{t.text}"
              </blockquote>

              {/* Autor */}
              <div className="border-t border-[var(--glass-border)] pt-4">
                <div className="flex items-center gap-3">
                  {/* Avatar com inicial */}
                  <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/25
                    flex items-center justify-center shrink-0">
                    <span className="text-gold text-xs font-display font-bold">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body font-semibold text-sm text-foreground leading-none">
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-xs font-body mt-0.5">
                      {t.location}
                    </p>
                  </div>
                </div>
                <p className="text-gold/70 text-xs font-body mt-2.5 uppercase tracking-wide">
                  {t.product}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-1">
                {s.value}
              </p>
              <p className="text-muted-foreground font-body text-sm uppercase tracking-wider">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />
    </section>
  );
};

export default TestimonialsSection;
