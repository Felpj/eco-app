import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cart.store";
import { formatMoney } from "@/lib/money";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/ProductImage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface OrderSummaryStickyProps {
  shipping?: number;
  orderBumpValue?: number;
}

export const OrderSummarySticky = ({
  shipping = 0,
  orderBumpValue = 0,
}: OrderSummaryStickyProps) => {
  const { items, coupon, getSubtotal, getDiscountTotal, getTotalPrice } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountTotal();
  const total = getTotalPrice() + shipping + orderBumpValue;

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Desktop - Always visible */}
      <div className="hidden lg:block">
        <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Resumo do Pedido
            </h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/carrinho" className="text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Link>
            </Button>
          </div>

          {/* Items (compact) */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-2 text-sm">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                  <ProductImage
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-body font-medium text-xs line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-muted-foreground font-body text-xs">
                    {item.quantity}x {formatMoney(item.product.price_brl)}
                  </p>
                </div>
                <p className="text-foreground font-body font-semibold text-xs">
                  {formatMoney(item.product.price_brl * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm text-foreground font-body">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>

            {coupon && discount > 0 && (
              <div className="flex justify-between text-sm text-primary font-body">
                <span>Desconto ({coupon.code})</span>
                <span>-{formatMoney(discount)}</span>
              </div>
            )}

            {shipping > 0 && (
              <div className="flex justify-between text-sm text-foreground font-body">
                <span>Frete</span>
                <span>{formatMoney(shipping)}</span>
              </div>
            )}

            {orderBumpValue > 0 && (
              <div className="flex justify-between text-sm text-foreground font-body">
                <span>Upsell</span>
                <span>{formatMoney(orderBumpValue)}</span>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-foreground font-body font-semibold">Total</span>
              <span className="text-foreground font-display text-xl font-bold">
                {formatMoney(total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile - Collapsible */}
      <div className="lg:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="w-full bg-card rounded-lg border border-border p-4 flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm font-body font-semibold text-foreground">
                Ver resumo do pedido
              </p>
              <p className="text-xs text-muted-foreground font-body">
                Total: {formatMoney(total)}
              </p>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 bg-card rounded-lg border border-border p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Resumo do Pedido
              </h3>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/carrinho" className="text-xs">
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Link>
              </Button>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-2 text-sm">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                    <ProductImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-body font-medium text-xs line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-muted-foreground font-body text-xs">
                      {item.quantity}x {formatMoney(item.product.price_brl)}
                    </p>
                  </div>
                  <p className="text-foreground font-body font-semibold text-xs">
                    {formatMoney(item.product.price_brl * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t border-border">
              <div className="flex justify-between text-sm text-foreground font-body">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>

              {coupon && discount > 0 && (
                <div className="flex justify-between text-sm text-primary font-body">
                  <span>Desconto ({coupon.code})</span>
                  <span>-{formatMoney(discount)}</span>
                </div>
              )}

              {shipping > 0 && (
                <div className="flex justify-between text-sm text-foreground font-body">
                  <span>Frete</span>
                  <span>{formatMoney(shipping)}</span>
                </div>
              )}

              {orderBumpValue > 0 && (
                <div className="flex justify-between text-sm text-foreground font-body">
                  <span>Upsell</span>
                  <span>{formatMoney(orderBumpValue)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-foreground font-body font-semibold">Total</span>
                <span className="text-foreground font-display text-xl font-bold">
                  {formatMoney(total)}
                </span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
};
