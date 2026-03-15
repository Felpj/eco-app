import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, RotateCcw, MessageCircle } from "lucide-react";

const guarantees = [
  { icon: Shield,    title: "Compra Segura",   description: "Pagamento 100% protegido" },
  { icon: Truck,     title: "Envio Express",   description: "Pedidos até 12h no mesmo dia" },
  { icon: RotateCcw, title: "Garantia",        description: "30 dias para troca ou devolução" },
];

const CTASection = () => {
  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Aurora intensa centralizada */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, rgba(201,168,76,0.14) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Ornamento */}
          <div className="ornament-line mb-6">
            <span className="text-gold/60 text-[10px] uppercase tracking-[0.3em] font-body px-3">
              Comece agora
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.1]">
            Pronto para descobrir seu{" "}
            <span className="text-gradient-gold">perfume</span>?
          </h2>

          <p className="text-editorial text-scent text-lg mb-4 max-w-xl mx-auto">
            "Fragrâncias que impressionam sem comprometer seu orçamento."
          </p>

          <p className="font-body text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            Satisfação garantida. Se não amar, devolvemos seu dinheiro em até 30 dias.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link
              to="/catalogo"
              className="shine-effect group inline-flex items-center justify-center gap-2
                bg-gradient-gold text-[#080808] font-body font-semibold
                px-8 py-4 rounded-xl text-sm tracking-wide
                hover:-translate-y-0.5 hover:shadow-gold-md
                transition-all duration-250 ease-expo-out"
            >
              Explorar Catálogo Completo
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <a
              href="https://wa.me/5518996718769?text=Olá! Gostaria de saber mais sobre os perfumes ESSENCE Árabe."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2
                glass border border-[rgba(201,168,76,0.2)] text-muted-foreground
                font-body font-medium px-8 py-4 rounded-xl text-sm
                hover:text-gold hover:border-[rgba(201,168,76,0.4)]
                transition-all duration-250 ease-expo-out"
            >
              <MessageCircle className="w-4 h-4" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Garantias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {guarantees.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-2xl flex flex-col items-center gap-3 p-5"
              >
                <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/20
                  flex items-center justify-center">
                  <g.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display font-semibold text-foreground text-sm">
                  {g.title}
                </h3>
                <p className="text-muted-foreground text-xs font-body text-center">
                  {g.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
