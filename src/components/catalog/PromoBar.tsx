import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, CreditCard, Star } from "lucide-react";

const messages = [
  {
    icon: Truck,
    text: (
      <>Pedidos até 12h: <strong>envio no mesmo dia</strong> — Após 12h: despacha amanhã cedo</>
    ),
  },
  {
    icon: Star,
    text: <>Mais de <strong>500 clientes satisfeitos</strong> em todo o Brasil</>,
  },
  {
    icon: CreditCard,
    text: <>Parcele em até <strong>12x sem juros</strong> no cartão de crédito</>,
  },
];

const PromoBar = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const { icon: Icon, text } = messages[current];

  return (
    <motion.div
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-gold border-b border-[rgba(201,168,76,0.2)] py-2.5 px-4 sticky top-0 z-50"
    >
      <div className="container mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-gold text-sm font-body"
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PromoBar;
