import { useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UpsellOffer } from "@/types/upsell";
import { useCartStore } from "@/store/cart.store";
import { formatMoney } from "@/lib/money";
import { trackUpsellEvent } from "@/lib/upsellTracking";
import { products } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface OrderBumpCardProps {
  offer: UpsellOffer;
  context: "CART" | "CHECKOUT";
  cartTotal: number;
}

export const OrderBumpCard = ({ offer, context, cartTotal }: OrderBumpCardProps) => {
  const { addItem, items } = useCartStore();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const productInCart = offer.productIds.some((pid) =>
      items.some((item) => item.product.id === pid),
    );
    setIsChecked(productInCart);
  }, [items, offer.productIds]);

  useEffect(() => {
    trackUpsellEvent(offer.id, "IMPRESSION", context, cartTotal);
  }, [offer.id, context, cartTotal]);

  const product = products.find((p) => p.id === offer.productIds[0]);
  if (!product) return null;

  let discountedPrice = product.price_brl;
  if (offer.discountType === "PERCENT" && offer.discountValue) {
    discountedPrice = product.price_brl * (1 - offer.discountValue / 100);
  } else if (offer.discountType === "FIXED" && offer.discountValue) {
    discountedPrice = product.price_brl - offer.discountValue;
  }

  const handleToggle = (checked: boolean) => {
    setIsChecked(checked);
    if (checked) {
      addItem(product, 1);
      trackUpsellEvent(offer.id, "ACCEPT", context, cartTotal);
      toast({ title: "Item adicionado!", description: offer.ui.description || "Adicionado ao seu pedido." });
    } else {
      trackUpsellEvent(offer.id, "DECLINE", context, cartTotal);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-gold rounded-2xl p-4 border border-[rgba(201,168,76,0.2)]"
    >
      {/* Badge oferta */}
      <div className="flex items-center gap-1.5 mb-3">
        <Zap className="w-3.5 h-3.5 text-gold" />
        <span className="text-[10px] text-gold font-body font-bold uppercase tracking-widest">
          {offer.ui.badge || "Oferta Especial"}
        </span>
      </div>

      <div className="flex items-start gap-4">
        {offer.ui.image && (
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#111] shrink-0">
            <img
              src={offer.ui.image}
              alt={offer.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground text-sm mb-0.5">
            {offer.title}
          </h3>
          {offer.subtitle && (
            <p className="text-xs text-muted-foreground font-body mb-2">{offer.subtitle}</p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground/60 line-through font-body">
              {formatMoney(product.price_brl)}
            </span>
            <span className="font-display font-bold text-gold text-lg">
              {formatMoney(discountedPrice)}
            </span>
          </div>

          {offer.ui.description && (
            <p className="text-xs text-muted-foreground/70 font-body mb-3">
              {offer.ui.description}
            </p>
          )}

          <label
            htmlFor={`bump-${offer.id}`}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <Checkbox
              id={`bump-${offer.id}`}
              checked={isChecked}
              onCheckedChange={handleToggle}
              className="w-5 h-5 border-gold/40 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
            />
            <span className="text-sm font-body text-foreground group-hover:text-gold transition-colors duration-200">
              {offer.ui.ctaText}
            </span>
            {isChecked && <Check className="w-4 h-4 text-gold" />}
          </label>
        </div>
      </div>
    </motion.div>
  );
};
