import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { formatMoney, calculateInstallment } from "@/lib/money";
import { validateCoupon } from "@/data/mockCoupons";
import { toast } from "@/hooks/use-toast";
import { X, Check, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  onCheckout?: () => void;
}

export const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { items, coupon, getSubtotal, getDiscountTotal, getTotalPrice, applyCoupon, removeCoupon } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountTotal();
  const total = getTotalPrice();
  const installment = calculateInstallment(total);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    const result = validateCoupon(couponCode, subtotal);

    if (result.valid && result.coupon) {
      applyCoupon({ code: result.coupon.code, discountType: result.coupon.discountType, value: result.coupon.value });
      toast({ title: "Cupom aplicado!", description: result.coupon.description || "Desconto aplicado com sucesso." });
      setCouponCode("");
    } else {
      toast({ title: "Cupom inválido", description: result.error || "Verifique o código e tente novamente.", variant: "destructive" });
    }
    setIsApplying(false);
  };

  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    else window.location.href = "/checkout";
  };

  if (items.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-6 space-y-6 sticky top-28">
      <h2 className="font-display text-xl font-semibold text-foreground">
        Resumo do Pedido
      </h2>

      {/* Linhas de valor */}
      <div className="space-y-3">
        <div className="flex justify-between text-foreground font-body text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>

        {coupon && discount > 0 && (
          <div className="flex justify-between items-center font-body text-sm">
            <div className="flex items-center gap-2 text-gold">
              <span>Cupom ({coupon.code})</span>
              <button
                onClick={() => { removeCoupon(); }}
                aria-label="Remover cupom"
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-gold font-semibold">-{formatMoney(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground font-body text-sm">
          <span>Frete</span>
          <span className="text-xs">Calculado no checkout</span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.2)] to-transparent" />

        <div className="flex justify-between items-end">
          <span className="text-foreground font-body font-semibold">Total</span>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-foreground">{formatMoney(total)}</p>
            <p className="text-muted-foreground text-xs font-body">12x de {formatMoney(installment)}</p>
          </div>
        </div>
      </div>

      {/* Campo cupom */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-body uppercase tracking-wider block">
          Cupom de desconto
        </label>
        {coupon ? (
          <div className="flex items-center gap-3 glass-gold rounded-xl px-4 py-3">
            <Check className="w-4 h-4 text-gold shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-semibold text-gold">{coupon.code}</p>
              <p className="text-xs text-muted-foreground font-body">
                {coupon.discountType === "PERCENT" ? `${coupon.value}% de desconto` : `${formatMoney(coupon.value)} de desconto`}
              </p>
            </div>
            <button onClick={removeCoupon} aria-label="Remover cupom" className="text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="CÓDIGO"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); } }}
              className="flex-1 glass rounded-xl px-4 py-2.5 text-sm font-body text-foreground
                placeholder:text-muted-foreground/40
                focus:border-[rgba(201,168,76,0.4)] focus:ring-2 focus:ring-gold/15 focus:outline-none
                transition-all duration-200"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isApplying || !couponCode.trim()}
              className={cn(
                "glass px-4 py-2.5 rounded-xl text-sm font-body font-medium",
                "text-gold border border-gold/30 hover:bg-gold/8 hover:border-gold/50",
                "transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              {isApplying ? "..." : "Aplicar"}
            </button>
          </div>
        )}
      </div>

      {/* CTA finalizar */}
      <button
        onClick={handleCheckout}
        className="w-full shine-effect group bg-gradient-gold text-[#080808]
          font-body font-bold py-4 rounded-xl text-sm tracking-wide
          flex items-center justify-center gap-2
          hover:-translate-y-0.5 hover:shadow-gold-md
          transition-all duration-250 ease-expo-out"
      >
        Finalizar Compra
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </button>

      {/* Selos de segurança */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-[var(--glass-border)]">
        {[
          { icon: ShieldCheck, label: "Compra segura" },
          { icon: Truck,       label: "Envio rápido" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-muted-foreground/60">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
