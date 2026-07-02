import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Minus, Plus, ShoppingBag, ShoppingCart, Bell, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { useCartStore } from "@/store/cart.store";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  if (!product) return null;

  const isOutOfStock = product.availability === "out_of_stock";
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const installment = Math.ceil(product.price_brl / 12);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Adicionado ao carrinho!",
      description: `${quantity}x ${product.name} no seu carrinho.`,
    });
    onClose();
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    onClose();
    navigate("/checkout");
  };

  // Sem estoque: notificação de retorno pelo WhatsApp (canal de suporte, não de compra).
  const handleNotify = () => {
    const message = `Olá! Quero ser avisado quando ${product.name} (${product.brand}) voltar ao estoque.`;
    window.open(`https://wa.me/5518996718769?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-2 gap-0"
        >
          {/* Image */}
          <div className="relative aspect-square bg-gradient-dark">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_best_seller && (
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-body font-semibold">
                  Mais Vendido
                </span>
              )}
              {isLowStock && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-body font-semibold">
                  Estoque baixo ({product.stock} un.)
                </span>
              )}
              {isOutOfStock && (
                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-body font-semibold">
                  Esgotado
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left mb-4">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">
                {product.brand}
              </p>
              <DialogTitle className="font-display text-2xl font-bold text-foreground">
                {product.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground font-body">
                {product.size_ml}ml • {product.audience}
              </p>
            </DialogHeader>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground font-body">
                {product.rating} ({product.reviews_count} avaliações)
              </span>
            </div>

            {/* Inspired By */}
            {product.inspired_by && (
              <div className="mb-4">
                <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-sm font-body">
                  Inspirado em <strong>{product.inspired_by}</strong>
                </span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-body capitalize"
                >
                  {tag.replace("_", " ")}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-foreground font-display text-3xl font-bold">
                  R$ {product.price_brl}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-body">
                ou 12x de R$ {installment} sem juros
              </p>
            </div>

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-foreground font-body">Quantidade:</span>
                <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-body font-medium text-foreground">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {isLowStock && (
                  <span className="text-xs text-orange-500 font-body">
                    Apenas {product.stock} em estoque
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-3">
              {isOutOfStock ? (
                <div className="space-y-3">
                  <Button variant="goldOutline" className="w-full gap-2" onClick={handleNotify}>
                    <Bell className="w-5 h-5" />
                    Avise-me quando voltar
                  </Button>
                  <p className="text-xs text-muted-foreground font-body text-center">
                    Te avisamos pelo WhatsApp assim que voltar
                  </p>
                </div>
              ) : (
                <>
                  <Button variant="gold" className="w-full gap-2" onClick={handleBuyNow}>
                    <ShoppingBag className="w-5 h-5" />
                    Comprar agora
                  </Button>
                  <Button variant="secondary" className="w-full gap-2" onClick={handleAddToCart}>
                    <ShoppingCart className="w-5 h-5" />
                    Adicionar ao carrinho
                  </Button>
                </>
              )}

              <Link to={`/produto/${product.slug}`} onClick={onClose}>
                <Button variant="goldOutline" className="w-full gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Ver página completa
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
