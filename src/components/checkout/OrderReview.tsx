import { useState } from "react";
import { useCartStore } from "@/store/cart.store";
import { formatMoney } from "@/lib/money";
import { ContactFormData } from "./ContactStep";
import { ShippingFormData } from "./ShippingStep";
import { PaymentFormData } from "./PaymentStep";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductImage } from "@/components/ui/ProductImage";
import { Label } from "@/components/ui/label";

interface OrderReviewProps {
  contact: ContactFormData;
  shipping: ShippingFormData;
  payment: PaymentFormData;
  onAcceptTerms?: (accepted: boolean) => void;
}

export const OrderReview = ({
  contact,
  shipping,
  payment,
  onAcceptTerms,
}: OrderReviewProps) => {
  const { items, getSubtotal, getDiscountTotal, getTotalPrice } = useCartStore();
  const [acceptTerms, setAcceptTerms] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountTotal();
  const shippingPrice =
    shipping.shippingMethod === "express" ? 15 : 10; // Mock shipping
  const upsellPrice = payment.addUpsell ? 29.9 : 0;
  const total = getTotalPrice() + shippingPrice + upsellPrice;

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    if (onAcceptTerms) {
      onAcceptTerms(checked);
    }
  };

  const shippingMethodLabel =
    shipping.shippingMethod === "express"
      ? "Expresso 24/48h"
      : "Normal";

  return (
    <div className="space-y-6">
      {/* Items */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Itens do Pedido
        </h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                <ProductImage
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-foreground">
                  {item.product.name}
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  {item.product.brand} • {item.product.size_ml}ml
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  Quantidade: {item.quantity}
                </p>
              </div>
              <p className="font-display font-bold text-foreground">
                {formatMoney(item.product.price_brl * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Dados de Contato
        </h3>
        <div className="bg-card rounded-lg border border-border p-4 space-y-2">
          <p className="text-foreground font-body">
            <strong>Nome:</strong> {contact.name}
          </p>
          <p className="text-foreground font-body">
            <strong>Email:</strong> {contact.email}
          </p>
          <p className="text-foreground font-body">
            <strong>WhatsApp:</strong> {contact.phone}
          </p>
        </div>
      </div>

      {/* Shipping Info */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Endereço de Entrega
        </h3>
        <div className="bg-card rounded-lg border border-border p-4 space-y-2">
          <p className="text-foreground font-body">
            {shipping.address}, {shipping.number}
            {shipping.complement && ` - ${shipping.complement}`}
          </p>
          <p className="text-foreground font-body">
            {shipping.neighborhood}, {shipping.city} - {shipping.state}
          </p>
          <p className="text-foreground font-body">
            CEP: {shipping.cep}
          </p>
          <p className="text-foreground font-body">
            <strong>Método:</strong> {shippingMethodLabel}
          </p>
        </div>
      </div>

      {/* Payment Info */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Pagamento
        </h3>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-foreground font-body">
            <strong>Método:</strong>{" "}
            {payment.method === "pix" ? "PIX" : "Cartão de Crédito"}
          </p>
          {payment.addUpsell && (
            <p className="text-foreground font-body mt-2">
              <strong>Upsell:</strong> Amostra 5ml adicionada
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-3">
        <div className="flex justify-between text-foreground font-body">
          <span>Subtotal</span>
          <span>{formatMoney(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-primary font-body">
            <span>Desconto</span>
            <span>-{formatMoney(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-foreground font-body">
          <span>Frete</span>
          <span>{formatMoney(shippingPrice)}</span>
        </div>
        {payment.addUpsell && (
          <div className="flex justify-between text-foreground font-body">
            <span>Upsell</span>
            <span>{formatMoney(upsellPrice)}</span>
          </div>
        )}
        <div className="border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="text-foreground font-body font-semibold">
              Total
            </span>
            <span className="text-foreground font-display text-2xl font-bold">
              {formatMoney(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-3 p-4 bg-card rounded-lg border border-border">
        <Checkbox
          id="accept-terms"
          checked={acceptTerms}
          onCheckedChange={(checked) => handleTermsChange(checked === true)}
          className="mt-1"
        />
        <Label
          htmlFor="accept-terms"
          className="text-sm text-foreground font-body cursor-pointer leading-relaxed"
        >
          Concordo com os{" "}
          <a href="#" className="text-primary hover:underline">
            termos de uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-primary hover:underline">
            política de privacidade
          </a>
        </Label>
      </div>
    </div>
  );
};
