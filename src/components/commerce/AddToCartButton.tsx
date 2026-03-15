import { useState } from "react";
import { ShoppingBag, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { Product } from "@/data/products";
import { toast } from "@/hooks/use-toast";

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
        <Check className="w-4 h-4 shrink-0" />
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
  );
};
