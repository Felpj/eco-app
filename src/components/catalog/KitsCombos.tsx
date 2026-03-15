import { motion } from "framer-motion";
import { Package, Percent, Gift, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const kits = [
  {
    id: "combo-2",
    title: "Combo 2 Perfumes",
    description: "Escolha 2 fragrâncias e ganhe 5% de desconto",
    discount: "5% OFF",
    icon: Package,
    color: "from-primary/20 to-primary/5"
  },
  {
    id: "combo-3",
    title: "Combo 3 Perfumes",
    description: "Monte seu kit com 3 perfumes e economize 10%",
    discount: "10% OFF",
    icon: Percent,
    color: "from-green-500/20 to-green-500/5"
  },
  {
    id: "kit-amostras",
    title: "Kit Descoberta",
    description: "5 amostras de 5ml das fragrâncias mais vendidas",
    discount: "R$ 89",
    icon: Gift,
    color: "from-purple-500/20 to-purple-500/5"
  }
];

const KitsCombos = () => {
  const handleWhatsApp = (kitTitle: string) => {
    const message = `Olá! Tenho interesse no ${kitTitle}. Pode me dar mais informações?`;
    window.open(`https://wa.me/5518996718769?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="py-12 bg-gradient-dark border-t border-border">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Kits & <span className="text-gradient-gold">Combos</span>
          </h2>
          <p className="text-muted-foreground font-body">
            Monte seu kit e economize ainda mais
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {kits.map((kit, index) => (
            <motion.div
              key={kit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-gold"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${kit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <kit.icon className="w-7 h-7 text-primary" />
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-body font-semibold mb-3">
                  {kit.discount}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {kit.title}
                </h3>
                <p className="text-muted-foreground text-sm font-body">
                  {kit.description}
                </p>
              </div>

              <Button
                variant="goldOutline"
                size="sm"
                className="w-full gap-2"
                onClick={() => handleWhatsApp(kit.title)}
              >
                <MessageCircle className="w-4 h-4" />
                Montar Kit
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KitsCombos;
