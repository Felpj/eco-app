import { useCartStore } from "@/store/cart.store";
import { formatMoney } from "@/lib/money";
import { ContactFormData } from "./ContactStep";
import { ShippingFormData } from "./ShippingStep";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductImage } from "@/components/ui/ProductImage";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QrCode, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardPaymentBrick } from "./CardPaymentBrick";
import type { OrderCardPayload } from "@/lib/api";

export type PaymentMethodChoice = "pix" | "card";

interface OrderReviewProps {
  contact: ContactFormData;
  shipping: ShippingFormData;
  paymentMethod: PaymentMethodChoice;
  onPaymentMethodChange: (method: PaymentMethodChoice) => void;
  shippingPrice: number;
  // Aceite dos termos é controlado pelo Checkout (fonte única) — o gate de
  // submit lê o MESMO valor que o checkbox mostra.
  acceptTerms: boolean;
  onAcceptTerms?: (accepted: boolean) => void;
  // Order bump já decidido na entrada da etapa: reflete no total e no Brick.
  bumpItem?: { name: string; price: number } | null;
  // Cartão via Mercado Pago (dark-launch): só habilita quando há public key.
  mpConfigured?: boolean;
  payerEmail?: string;
  onCardSubmit?: (data: OrderCardPayload) => Promise<void>;
}

export const OrderReview = ({
  contact,
  shipping,
  paymentMethod,
  onPaymentMethodChange,
  shippingPrice,
  acceptTerms,
  onAcceptTerms,
  bumpItem,
  mpConfigured = false,
  payerEmail,
  onCardSubmit,
}: OrderReviewProps) => {
  const { items, getSubtotal, getDiscountTotal, getTotalPrice } = useCartStore();

  const subtotal = getSubtotal();
  const discount = getDiscountTotal();
  const bumpPrice = bumpItem?.price ?? 0;
  const total = getTotalPrice() + shippingPrice + bumpPrice;

  const handleTermsChange = (checked: boolean) => {
    onAcceptTerms?.(checked);
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

      {/* Payment Method */}
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Pagamento
        </h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => onPaymentMethodChange(v as PaymentMethodChoice)}
          className="space-y-3"
        >
          <div
            onClick={() => onPaymentMethodChange("pix")}
            className={cn(
              "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
              paymentMethod === "pix"
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="pix" id="pay-pix" />
            <QrCode
              className={cn(
                "w-5 h-5",
                paymentMethod === "pix" ? "text-primary" : "text-muted-foreground"
              )}
            />
            <div className="flex-1">
              <Label
                htmlFor="pay-pix"
                className="font-body font-semibold text-foreground cursor-pointer"
              >
                PIX
              </Label>
              <p className="text-sm text-muted-foreground font-body">
                Aprovação imediata — QR Code na próxima tela
              </p>
            </div>
          </div>

          {mpConfigured ? (
            <div
              onClick={() => onPaymentMethodChange("card")}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                paymentMethod === "card"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <RadioGroupItem value="card" id="pay-card" />
              <CreditCard
                className={cn(
                  "w-5 h-5",
                  paymentMethod === "card" ? "text-primary" : "text-muted-foreground"
                )}
              />
              <div className="flex-1">
                <Label
                  htmlFor="pay-card"
                  className="font-body font-semibold text-foreground cursor-pointer"
                >
                  Cartão de Crédito
                </Label>
                <p className="text-sm text-muted-foreground font-body">
                  Em até 12x — dados protegidos pelo Mercado Pago
                </p>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-4 p-4 rounded-lg border-2 border-border bg-card opacity-50 cursor-not-allowed"
              aria-disabled
            >
              <RadioGroupItem value="card" id="pay-card" disabled />
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <Label
                  htmlFor="pay-card"
                  className="font-body font-semibold text-foreground"
                >
                  Cartão de Crédito
                </Label>
                <p className="text-sm text-muted-foreground font-body">
                  Em breve
                </p>
              </div>
            </div>
          )}
        </RadioGroup>

        {mpConfigured && paymentMethod === "card" && onCardSubmit && (
          <div className="mt-4">
            {/* Brick sempre visível — o cliente preenche o cartão à vontade. O
                aceite dos termos gateia o SUBMIT (rejeitado no onSubmit se não
                marcado), não a renderização. */}
            <CardPaymentBrick
              amount={total}
              payerEmail={payerEmail}
              onCardSubmit={onCardSubmit}
            />
            {!acceptTerms && (
              <p className="mt-2 text-xs text-muted-foreground font-body">
                Marque o aceite dos termos abaixo para concluir o pagamento.
              </p>
            )}
          </div>
        )}
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
        {bumpItem && (
          <div className="flex justify-between text-foreground font-body">
            <span className="truncate pr-2">+ {bumpItem.name}</span>
            <span>{formatMoney(bumpItem.price)}</span>
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
