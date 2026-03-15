import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpsellOffer } from "@/types/upsell";
import { useCartStore } from "@/store/cart.store";
import { formatMoney } from "@/lib/money";
import { trackUpsellEvent } from "@/lib/upsellTracking";
import { products } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { getEligibleOffers } from "@/data/upsellOffers";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

interface UpsellShelfProps {
  context: "PDP" | "CART";
  currentProductId?: string;
}

export const UpsellShelf = ({ context, currentProductId }: UpsellShelfProps) => {
  const { items, getSubtotal, addItem } = useCartStore();
  const cartTotal = getSubtotal();
  const cartProductIds = items.map((item) => item.product.id);

  // Busca ofertas elegíveis
  const eligibleOffers = getEligibleOffers(
    context,
    cartTotal,
    cartProductIds,
    currentProductId
  ).filter((offer) => offer.type !== "ORDER_BUMP" && offer.type !== "POST_PURCHASE");

  // Track impressions
  useEffect(() => {
    eligibleOffers.forEach((offer) => {
      trackUpsellEvent(offer.id, "IMPRESSION", context, cartTotal);
    });
  }, [eligibleOffers, context, cartTotal]);

  if (eligibleOffers.length === 0) {
    return null;
  }

  const handleAddProduct = (offer: UpsellOffer) => {
    const productId = offer.productIds[0];
    const product = products.find((p) => p.id === productId);

    if (product) {
      addItem(product, 1);
      trackUpsellEvent(offer.id, "ACCEPT", context, cartTotal);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-foreground">
          {context === "PDP" ? "Compre junto" : "Você também pode gostar"}
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {eligibleOffers.map((offer) => {
          const product = products.find((p) => p.id === offer.productIds[0]);
          if (!product) return null;

          let discountedPrice = product.price_brl;
          if (offer.discountType === "PERCENT" && offer.discountValue) {
            discountedPrice = product.price_brl * (1 - offer.discountValue / 100);
          } else if (offer.discountType === "FIXED" && offer.discountValue) {
            discountedPrice = product.price_brl - offer.discountValue;
          }

          return (
            <div
              key={offer.id}
              className="flex-shrink-0 w-64 bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
            >
              {offer.ui.badge && (
                <Badge className="mb-2 bg-primary text-primary-foreground text-xs font-body">
                  {offer.ui.badge}
                </Badge>
              )}
              <div className="w-full h-48 rounded-lg overflow-hidden border border-border mb-3">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1">
                {product.name}
              </h3>
              {product.inspired_by && (
                <p className="text-xs text-muted-foreground font-body mb-2">
                  Inspirado em {product.inspired_by}
                </p>
              )}
              <div className="flex items-center gap-2 mb-3">
                {product.price_brl > discountedPrice && (
                  <span className="text-sm text-muted-foreground line-through font-body">
                    {formatMoney(product.price_brl)}
                  </span>
                )}
                <span className="font-display font-bold text-primary text-lg">
                  {formatMoney(discountedPrice)}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleAddProduct(offer)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
