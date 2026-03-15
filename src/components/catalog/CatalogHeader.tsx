import { motion } from "framer-motion";
import { Sparkles, Clock, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Sparkles,
    title: "Cheiro de grife",
    description: "Inspirados em fragrâncias de nicho"
  },
  {
    icon: Zap,
    title: "Fixação elogiada",
    description: "Até 18h de duração"
  },
  {
    icon: Clock,
    title: "Envio rápido",
    description: "Cutoff 12h, despacha no mesmo dia"
  }
];

const CatalogHeader = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/5518996718769?text=Olá! Gostaria de saber mais sobre os perfumes.", "_blank");
  };

  return (
    <section className="bg-gradient-dark py-12 md:py-16 border-b border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Perfume árabe com <span className="text-gradient-gold">cheiro de grife</span>
            <br className="hidden sm:block" />
            — pagando muito menos
          </h1>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-2xl mx-auto mb-6">
            Inspirados em fragrâncias famosas. Alta fixação. Custo-benefício absurdo.
          </p>
          <Button 
            variant="goldOutline" 
            size="lg"
            onClick={handleWhatsApp}
            className="gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Falar no WhatsApp
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogHeader;
