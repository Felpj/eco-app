import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";

// Partículas douradas que disparam ao adicionar ao carrinho
const PARTICLES = [
  { x: -22, y: -26 }, { x: 20, y: -30 }, { x: -30, y: -8 },
  { x: 28, y: -10 }, { x: -12, y: -34 }, { x: 12, y: -32 },
];

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: "default" | "gold" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  className?: string;
  disabled?: boolean;
}

export const AddToCartButton = ({
  product,
  quantity = 1,
  variant = "gold",
  size = "default",
  className,
  disabled = false,
}: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = product.availability === "out_of_stock";
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const reduceMotion = useReducedMotion();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock || disabled || status !== "idle") return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 400));
    addItem(product, quantity);
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
    setStatus("success");
    setTimeout(() => setStatus("idle"), 1500);
  };

  const isIconOnly = size === "icon";
  const isBusy = status === "loading" || status === "success";

  return (
    <div className="relative inline-flex">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAddToCart}
        disabled={isOutOfStock || disabled || isBusy}
        aria-label={isOutOfStock ? "Esgotado" : "Adicionar ao carrinho"}
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
        ) : status === "success" ? (
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: [0, 1.3, 1], rotate: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex"
          >
            <Check className="w-4 h-4 shrink-0" />
          </motion.span>
        ) : (
          <ShoppingBag className="w-4 h-4 shrink-0" />
        )}
        {!isIconOnly &&
          (isOutOfStock
            ? "Esgotado"
            : status === "loading"
              ? "Adicionando..."
              : status === "success"
                ? "Adicionado!"
                : "Adicionar ao carrinho")}
      </Button>

      {/* Burst de partículas douradas na celebração */}
      <AnimatePresence>
        {status === "success" && !reduceMotion && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ opacity: 0, x: p.x, y: p.y, scale: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-1.5 h-1.5 rounded-full bg-gold shadow-[0_0_8px_2px_rgba(201,168,76,0.6)]"
              />
            ))}
          </span>
        )}
      </AnimatePresence>
    </div>
  );
};
