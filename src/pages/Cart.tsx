import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CartItemRow } from "@/components/commerce/CartItemRow";
import { CartSummary } from "@/components/commerce/CartSummary";
import { CartEmptyState } from "@/components/commerce/CartEmptyState";
import { FreeShippingProgress } from "@/components/upsell/FreeShippingProgress";
import { OrderBumpCard } from "@/components/upsell/OrderBumpCard";
import { BundleCard } from "@/components/upsell/BundleCard";
import { UpsellShelf } from "@/components/upsell/UpsellShelf";
import { useCartStore } from "@/store/cart.store";
import { getEligibleOffers } from "@/data/upsellOffers";
import { motion } from "framer-motion";

const Cart = () => {
  const { items, getSubtotal } = useCartStore();
  const cartTotal = getSubtotal();
  const cartProductIds = items.map((item) => item.product.id);

  // Busca ofertas elegíveis
  const orderBumps = getEligibleOffers("CART", cartTotal, cartProductIds).filter(
    (o) => o.type === "ORDER_BUMP"
  );
  const bundles = getEligibleOffers("CART", cartTotal, cartProductIds).filter(
    (o) => o.type === "BUNDLE"
  );

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)]">
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
                transition-colors duration-200 mb-8 font-body text-sm group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Continuar comprando
            </Link>
            <CartEmptyState />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
              transition-colors duration-200 mb-8 font-body text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Continuar comprando
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Carrinho de Compras
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Free Shipping Progress */}
              <FreeShippingProgress cartTotal={cartTotal} />

              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CartItemRow item={item} />
                  </motion.div>
                ))}
              </div>

              {/* Order Bumps */}
              {orderBumps.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    Adicione ao seu pedido
                  </h2>
                  {orderBumps.map((offer) => (
                    <OrderBumpCard
                      key={offer.id}
                      offer={offer}
                      context="CART"
                      cartTotal={cartTotal}
                    />
                  ))}
                </div>
              )}

              {/* Bundles */}
              {bundles.length > 0 && (
                <div className="space-y-4">
                  <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    Kits Especiais
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {bundles.map((offer) => (
                      <BundleCard
                        key={offer.id}
                        offer={offer}
                        context="CART"
                        cartTotal={cartTotal}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Upsell Shelf */}
              <UpsellShelf context="CART" />
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <CartSummary />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
