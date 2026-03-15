import { motion } from "framer-motion";

const pillars = [
  { label: "Autenticidade", description: "Origens verificadas do Oriente Médio" },
  { label: "Raridade",      description: "Fórmulas exclusivas e limitadas" },
  { label: "Acesso",        description: "Luxo genuíno a preço justo" },
];

const PhilosophySection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Padrão geométrico árabe ultra-sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              hsl(var(--gold)) 0px, hsl(var(--gold)) 1px,
              transparent 0px, transparent 50%
            ),
            repeating-linear-gradient(
              -45deg,
              hsl(var(--gold)) 0px, hsl(var(--gold)) 1px,
              transparent 0px, transparent 50%
            )
          `,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Ornamento */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="ornament-line mb-6"
          >
            <span className="text-gold/60 text-[10px] uppercase tracking-[0.3em] font-body px-3">
              O Que Nos Move
            </span>
          </motion.div>

          {/* Citação principal */}
          <motion.blockquote
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-2xl md:text-3xl lg:text-4xl italic text-foreground/90
              leading-relaxed mb-6 font-light"
          >
            "Cada frasco que chega até você carrega a história de uma cultura milenar.
            Fragrâncias que não se compram em qualquer lugar."
          </motion.blockquote>

          {/* Descrição */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-muted-foreground leading-relaxed mb-14 max-w-xl mx-auto"
          >
            Nascemos da paixão por perfumaria árabe e do desejo de tornar esse universo
            acessível ao Brasil. Cada fragrância é cuidadosamente selecionada e testada.
          </motion.p>

          {/* Três pilares */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 glass rounded-2xl p-6 text-center"
              >
                {/* Número decorativo */}
                <p className="font-display text-4xl font-bold text-gradient-gold opacity-30 mb-2 leading-none">
                  0{i + 1}
                </p>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {pillar.label}
                </h3>
                <p className="text-muted-foreground text-sm font-body">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
