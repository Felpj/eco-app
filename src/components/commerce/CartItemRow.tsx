import { Minus, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, CartItem } from "@/store/cart.store";
import { formatMoney } from "@/lib/money";

interface CartItemRowProps {
  item: CartItem;
}

export const CartItemRow = ({ item }: CartItemRowProps) => {
  const { increment, decrement, removeItem } = useCartStore();
  const { product, quantity } = item;
  const subtotal = product.price_brl * quantity;

  const handleDecrease = () => {
    if (quantity > 1) decrement(product.id);
    else removeItem(product.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-xl p-4 flex gap-4"
    >
      {/* Imagem */}
      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#111]">
        <ProductImage
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-1">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              {product.brand} · {product.size_ml}ml
            </p>
            {product.inspired_by && (
              <p className="text-xs text-muted-foreground/60 font-body mt-0.5">
                Inspirado em {product.inspired_by}
              </p>
            )}
          </div>

          {/* Remover */}
          <button
            onClick={() => removeItem(product.id)}
            aria-label={`Remover ${product.name} do carrinho`}
            className="text-muted-foreground/50 hover:text-destructive
              transition-colors duration-200 p-1 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Qty + preço */}
        <div className="flex items-center justify-between mt-3">
          {/* Stepper pill */}
          <div className="flex items-center glass rounded-xl overflow-hidden border border-[var(--glass-border)]">
            <button
              onClick={handleDecrease}
              aria-label="Diminuir quantidade"
              className="w-9 h-8 flex items-center justify-center text-muted-foreground
                hover:text-gold hover:bg-gold/5 transition-colors duration-200"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-foreground font-body font-semibold text-sm w-7 text-center">
              {quantity}
            </span>
            <button
              onClick={() => increment(product.id)}
              aria-label="Aumentar quantidade"
              className="w-9 h-8 flex items-center justify-center text-muted-foreground
                hover:text-gold hover:bg-gold/5 transition-colors duration-200"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Subtotal */}
          <AnimatePresence mode="wait">
            <motion.p
              key={subtotal}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="font-display text-lg font-bold text-gold"
            >
              {formatMoney(subtotal)}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
