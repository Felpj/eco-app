import { ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatMoney } from "@/lib/money";
import type { CheckoutBump } from "@/lib/api";

interface CheckoutBumpModalProps {
  bump: CheckoutBump;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Order bump exibido no clique de "Confirmar pagamento". Data-driven do backend
 * (produto + preço especial vêm de GET /offers/checkout-bump). Aceitar/recusar apenas
 * sinalizam de volta pro Checkout — o item e o preço real são resolvidos no POST /orders.
 * (Reaproveita o visual do PostPurchaseOfferModal, sem o acoplamento a mock/carrinho.)
 */
export const CheckoutBumpModal = ({
  bump,
  isOpen,
  onAccept,
  onDecline,
}: CheckoutBumpModalProps) => {
  const { product } = bump;
  const hasDiscount = product.specialPrice < product.originalPrice;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onDecline();
      }}
    >
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold text-foreground">
            {bump.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {bump.badge && (
            <Badge className="bg-primary text-primary-foreground font-body">
              {bump.badge}
            </Badge>
          )}

          {bump.subtitle && (
            <p className="text-sm text-muted-foreground font-body">
              {bump.subtitle}
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
            <div className="flex items-center gap-2">
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through font-body">
                  {formatMoney(product.originalPrice)}
                </span>
              )}
              <span className="font-display font-bold text-primary text-2xl">
                {formatMoney(product.specialPrice)}
              </span>
            </div>
          </div>

          {bump.description && (
            <p className="text-xs text-muted-foreground font-body bg-primary/10 rounded-lg p-3">
              {bump.description}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={onDecline}>
              Não, obrigado
            </Button>
            <Button variant="gold" className="flex-1" onClick={onAccept}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {bump.ctaText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
