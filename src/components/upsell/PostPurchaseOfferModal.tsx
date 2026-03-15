import { useState, useEffect } from "react";
import { X, Clock, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpsellOffer } from "@/types/upsell";
import { useCartStore } from "@/store/cart.store";
import { formatMoney } from "@/lib/money";
import { trackUpsellEvent } from "@/lib/upsellTracking";
import { products } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface PostPurchaseOfferModalProps {
  offer: UpsellOffer;
  orderCode: string;
  isOpen: boolean;
  onClose: () => void;
}

export const PostPurchaseOfferModal = ({
  offer,
  orderCode,
  isOpen,
  onClose,
}: PostPurchaseOfferModalProps) => {
  const navigate = useNavigate();
  const { addItem, getSubtotal } = useCartStore();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos
  const [isExpired, setIsExpired] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || !offer.expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(offer.expiresAt!).getTime();
      const remaining = Math.max(0, Math.floor((expires - now) / 1000));

      setTimeLeft(remaining);
      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, offer.expiresAt]);

  // Track impression
  useEffect(() => {
    if (isOpen) {
      trackUpsellEvent(offer.id, "IMPRESSION", "THANK_YOU", getSubtotal(), orderCode);
    }
  }, [isOpen, offer.id, getSubtotal, orderCode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAccept = () => {
    const productId = offer.productIds[0];
    const product = products.find((p) => p.id === productId);

    if (product) {
      // Calcula preço com desconto
      let finalPrice = product.price_brl;
      if (offer.discountType === "PERCENT" && offer.discountValue) {
        finalPrice = product.price_brl * (1 - offer.discountValue / 100);
      } else if (offer.discountType === "FIXED" && offer.discountValue) {
        finalPrice = product.price_brl - offer.discountValue;
      }

      addItem(product, 1);
      trackUpsellEvent(offer.id, "ACCEPT", "THANK_YOU", getSubtotal(), orderCode);
      toast({
        title: "Oferta aceita!",
        description: "Produto adicionado ao carrinho. Continue para finalizar o pedido.",
      });
      onClose();
      navigate("/carrinho");
    }
  };

  const handleDecline = () => {
    trackUpsellEvent(offer.id, "DECLINE", "THANK_YOU", getSubtotal(), orderCode);
    onClose();
  };

  const product = products.find((p) => p.id === offer.productIds[0]);
  if (!product) return null;

  let originalPrice = product.price_brl;
  let discountedPrice = product.price_brl;

  if (offer.discountType === "PERCENT" && offer.discountValue) {
    discountedPrice = product.price_brl * (1 - offer.discountValue / 100);
  } else if (offer.discountType === "FIXED" && offer.discountValue) {
    discountedPrice = product.price_brl - offer.discountValue;
  }

  return (
    <Dialog open={isOpen && !isExpired} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-2xl font-bold text-foreground">
              {offer.title}
            </DialogTitle>
            {!isExpired && (
              <div className="flex items-center gap-2 text-primary font-body">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {offer.ui.badge && (
            <Badge className="bg-primary text-primary-foreground font-body">
              {offer.ui.badge}
            </Badge>
          )}

          {offer.subtitle && (
            <p className="text-sm text-muted-foreground font-body">
              {offer.subtitle}
            </p>
          )}

          <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-2">
              {product.name}
            </h3>
            {product.inspired_by && (
              <p className="text-xs text-muted-foreground font-body mb-3">
                Inspirado em {product.inspired_by}
              </p>
            )}
            <div className="flex items-center gap-2">
              {originalPrice > discountedPrice && (
                <span className="text-sm text-muted-foreground line-through font-body">
                  {formatMoney(originalPrice)}
                </span>
              )}
              <span className="font-display font-bold text-primary text-2xl">
                {formatMoney(discountedPrice)}
              </span>
            </div>
          </div>

          {offer.ui.description && (
            <p className="text-xs text-muted-foreground font-body bg-primary/10 rounded-lg p-3">
              {offer.ui.description}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDecline}
            >
              Não, obrigado
            </Button>
            <Button
              variant="gold"
              className="flex-1"
              onClick={handleAccept}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {offer.ui.ctaText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
