import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { ContactStep, ContactFormData } from "@/components/checkout/ContactStep";
import { ShippingStep, ShippingFormData } from "@/components/checkout/ShippingStep";
import {
  OrderReview,
  type PaymentMethodChoice,
} from "@/components/checkout/OrderReview";
import { OrderSummarySticky } from "@/components/checkout/OrderSummarySticky";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutDraft } from "@/hooks/use-checkout-draft";
import { cn } from "@/lib/utils";
import {
  ApiError,
  createOrder,
  getCheckoutBump,
  quoteShipping,
  validateOrderStock,
  type CheckoutBump,
  type CreateOrderPayload,
  type OrderCardPayload,
  type PaymentMethod,
  type ShippingMethodId,
  type ShippingQuoteOption,
} from "@/lib/api";
import { CheckoutBumpModal } from "@/components/upsell/CheckoutBumpModal";
import { getAffiliateSessionId } from "@/lib/affiliate-tracking";
import { isMercadoPagoConfigured } from "@/lib/mercadopago";
import { toast } from "@/hooks/use-toast";

// Revisão e pagamento são o MESMO step: revisa tudo, escolhe o método e confirma.
const steps = [
  { id: "contact", label: "Contato", number: 1 },
  { id: "shipping", label: "Entrega", number: 2 },
  { id: "payment", label: "Pagamento", number: 3 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal, getTotalPrice } = useCartStore();
  const { draft, updateDraft, clearDraft } = useCheckoutDraft();
  const cartProductIds = items.map((item) => item.product.id);
  // Cartão via Mercado Pago (dark-launch): só ativa quando a public key existe.
  const mpConfigured = isMercadoPagoConfigured();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [contactData, setContactData] = useState<ContactFormData | null>(
    draft?.contact
      ? {
          name: draft.contact.fullName,
          email: draft.contact.email || "",
          phone: draft.contact.whatsapp,
          wantsWhatsAppUpdates: draft.contact.wantsWhatsAppUpdates || false,
        }
      : null
  );
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(
    draft?.delivery
      ? {
          cep: draft.delivery.cep,
          address: draft.delivery.addressLine1,
          number: "",
          complement: draft.delivery.addressLine2 || "",
          neighborhood: draft.delivery.neighborhood,
          city: draft.delivery.city,
          state: draft.delivery.state,
          shippingMethod:
            draft.delivery.shippingMethodId === "EXPRESS_24H" ? "express" : "normal",
        }
      : null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodChoice>(
    draft?.payment?.method === "CARD" ? "card" : "pix"
  );
  // Consentimento FRESCO a cada checkout (não hidrata do draft) — o aceite
  // gateia PIX (botão) e cartão (onSubmit do Brick); precisa ser explícito agora.
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Slice 2: estado para shipping quote, validações e submit
  const [shippingQuotes, setShippingQuotes] = useState<ShippingQuoteOption[] | null>(null);
  const [isQuotingShipping, setIsQuotingShipping] = useState(false);
  // Frete grátis vindo da quote (null quando a loja desativou) — alimenta a barra.
  const [shippingFree, setShippingFree] = useState<{
    threshold: number | null;
    amount: number | null;
  }>({ threshold: null, amount: null });
  const [stockErrors, setStockErrors] = useState<
    { productId: string; reason: string }[] | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Order bump da loja (backend). Mostrado UMA vez no clique de "Confirmar pagamento".
  const [bump, setBump] = useState<CheckoutBump | null>(null);
  const [bumpModalOpen, setBumpModalOpen] = useState(false);
  const [bumpShown, setBumpShown] = useState(false);
  // Bump decidido ANTES do pagamento (ao entrar na etapa 3): entra no pedido e
  // reflete no total exibido + no amount do Brick (valor final antes de pagar).
  const [acceptedBump, setAcceptedBump] = useState<CheckoutBump | null>(null);

  // Idempotency-Key gerado 1× no mount; reusado em retries.
  // Reset acontece via mudança de chave (key na rota) ou unmount (volta pra cart).
  const idempotencyKeyRef = useRef<string>("");
  if (!idempotencyKeyRef.current) {
    idempotencyKeyRef.current =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  // Carrega o order bump configurado pela loja (ou null). Silencioso se falhar.
  useEffect(() => {
    let active = true;
    getCheckoutBump()
      .then((b) => {
        if (active) setBump(b);
      })
      .catch(() => {
        if (active) setBump(null);
      });
    return () => {
      active = false;
    };
  }, []);

  // Order bump: oferece UMA vez ao chegar na etapa de pagamento (índice 2),
  // igual pra PIX e cartão. Decidido aqui, o valor fica final ANTES do Brick
  // montar (parcelas do cartão calculadas sobre o total já com o bump).
  const bumpInCart = bump ? cartProductIds.includes(bump.product.id) : false;
  useEffect(() => {
    if (currentStep === 2 && bump && !bumpShown && !bumpInCart) {
      setBumpShown(true);
      setBumpModalOpen(true);
    }
  }, [currentStep, bump, bumpShown, bumpInCart]);

  // Items canonicos (productId + qty) — referência estável p/ effects
  const orderItems = useMemo(
    () => items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
    [items],
  );
  const orderItemsKey = useMemo(
    () => orderItems.map((i) => `${i.productId}:${i.quantity}`).join("|"),
    [orderItems],
  );

  // Marca que um pedido foi criado e estamos indo pro /pedido. O effect de
  // carrinho-vazio abaixo NÃO pode disparar nesse caso — senão rouba a navegação
  // quando o clearCart esvazia o carrinho. Ref (síncrono, imune ao batching do
  // React) porque o guard isSubmitting sozinho não segura: ele reseta no MESMO
  // tick do clearCart, então o effect ainda enxerga carrinho vazio + submit=false.
  const placedOrderRef = useRef(false);

  // Redirect empty cart in useEffect (never during render — causes "Cannot update component while rendering")
  useEffect(() => {
    if (items.length === 0 && !isSubmitting && !placedOrderRef.current) {
      navigate("/carrinho");
    }
  }, [items.length, isSubmitting, navigate]);

  // Slice 2: quote de frete sempre que mudar CEP ou itens. O CEP vem do que o
  // usuário digita/seleciona DENTRO do ShippingStep (via onCepChange) — antes
  // só reagia ao draft, e o step mostrava preço flat enquanto o resumo cobrava
  // a quote real.
  const [quoteCep, setQuoteCep] = useState<string>(
    draft?.delivery?.cep?.replace(/\D/g, "") ?? ""
  );
  const cep = quoteCep || (shippingData?.cep?.replace(/\D/g, "") ?? "");
  useEffect(() => {
    if (cep.length !== 8 || orderItems.length === 0) {
      setShippingQuotes(null);
      setShippingFree({ threshold: null, amount: null });
      return;
    }
    let cancelled = false;
    setIsQuotingShipping(true);
    quoteShipping({ cep, items: orderItems })
      .then((res) => {
        if (cancelled) return;
        setShippingQuotes(res.options);
        setShippingFree({
          threshold: res.freeShippingThreshold,
          amount: res.amountToFreeShipping,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError ? err.message : "Não foi possível calcular o frete.";
        toast({ title: "Frete", description: message, variant: "destructive" });
        setShippingQuotes(null);
        setShippingFree({ threshold: null, amount: null });
      })
      .finally(() => {
        if (!cancelled) setIsQuotingShipping(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cep, orderItemsKey, orderItems]);

  // Frete atualmente escolhido (id derivado do shippingData)
  const chosenShippingId: ShippingMethodId =
    shippingData?.shippingMethod === "express" ? "EXPRESS_24H" : "STANDARD";
  const chosenShippingPrice =
    shippingQuotes?.find((o) => o.id === chosenShippingId)?.price ??
    (shippingData?.shippingMethod === "express" ? 15 : 10);

  // Reflete o bump aceito em todos os resumos (OrderReview + sticky) e no Brick.
  const bumpSummaryItem = acceptedBump
    ? { name: acceptedBump.product.name, price: acceptedBump.product.specialPrice }
    : null;

  const handleContactSubmit = (data: ContactFormData) => {
    setContactData(data);
    setDirection(1);
    setCurrentStep(1);
  };

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setDirection(1);
    setCurrentStep(2);
  };

  useEffect(() => {
    if (contactData || shippingData) {
      updateDraft({
        contact: contactData
          ? {
              fullName: contactData.name,
              whatsapp: contactData.phone,
              email: contactData.email,
              wantsWhatsAppUpdates: contactData.wantsWhatsAppUpdates,
            }
          : undefined,
        delivery: shippingData
          ? {
              cep: shippingData.cep,
              addressLine1: shippingData.address,
              addressLine2: shippingData.complement,
              neighborhood: shippingData.neighborhood,
              city: shippingData.city,
              state: shippingData.state,
              shippingMethodId:
                shippingData.shippingMethod === "express" ? "EXPRESS_24H" : "STANDARD",
            }
          : undefined,
        payment: {
          method: paymentMethod.toUpperCase() as "PIX" | "CARD",
        },
        acceptTerms,
      });
    }
  }, [contactData, shippingData, paymentMethod, acceptTerms, updateDraft]);

  const handleFinalSubmit = async () => {
    if (!acceptTerms) {
      const termsCheckbox = document.getElementById("accept-terms");
      if (termsCheckbox) {
        termsCheckbox.scrollIntoView({ behavior: "smooth", block: "center" });
        termsCheckbox.focus();
      }
      return;
    }
    // O bump já foi oferecido ao entrar na etapa — acceptedBump reflete a escolha.
    await submitOrder(acceptedBump);
  };

  // Aceitar/recusar o bump apenas REGISTRA a escolha (o submit real vem depois,
  // no botão de PIX ou no do Brick) — assim o valor fica final antes de pagar.
  const handleBumpAccept = () => {
    setAcceptedBump(bump);
    setBumpModalOpen(false);
  };

  const handleBumpDecline = () => {
    setAcceptedBump(null);
    setBumpModalOpen(false);
  };

  const submitOrder = async (
    upsell: CheckoutBump | null,
    cardData?: OrderCardPayload,
  ) => {
    if (!contactData || !shippingData) return;
    if (isSubmitting) return;

    setSubmitError(null);
    setStockErrors(null);
    setIsSubmitting(true);

    // Bump aceito entra só no pedido enviado, não no carrinho persistente.
    const finalItems = upsell
      ? [...orderItems, { productId: upsell.product.id, quantity: 1 }]
      : orderItems;

    try {
      // 1. validate stock antes de criar order
      const stock = await validateOrderStock({ items: finalItems });
      if (!stock.valid) {
        setStockErrors(stock.errors);
        toast({
          title: "Itens indisponíveis",
          description: "Alguns itens do carrinho não estão disponíveis.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const couponCode = useCartStore.getState().coupon?.code;

      const payload: CreateOrderPayload = {
        contact: {
          fullName: contactData.name,
          whatsapp: contactData.phone,
          email: contactData.email || undefined,
          wantsWhatsAppUpdates: contactData.wantsWhatsAppUpdates || false,
        },
        delivery: {
          cep: shippingData.cep.replace(/\D/g, ""),
          street: shippingData.address,
          number: shippingData.number,
          complement: shippingData.complement || undefined,
          neighborhood: shippingData.neighborhood,
          city: shippingData.city,
          state: shippingData.state.toUpperCase(),
          shippingMethodId:
            shippingData.shippingMethod === "express" ? "EXPRESS_24H" : "STANDARD",
        },
        payment: cardData
          ? { method: "CARD" as PaymentMethod, card: cardData }
          : { method: paymentMethod.toUpperCase() as PaymentMethod },
        items: finalItems,
        couponCode: couponCode || undefined,
        upsellOfferId: upsell?.offerId,
      };

      const affiliateSessionId = getAffiliateSessionId();
      const order = await createOrder(
        payload,
        idempotencyKeyRef.current,
        affiliateSessionId,
      );

      // Marca ANTES de qualquer navigate/clear (síncrono) pra travar o effect
      // de carrinho-vazio. navigate antes do clearCart (o clearCart esvazia o
      // carrinho e desmonta o Checkout; navigate de componente desmontado é no-op).
      placedOrderRef.current = true;
      navigate(`/pedido/${order.orderCode}`);
      clearCart();
      clearDraft();
    } catch (err) {
      if (err instanceof ApiError) {
        // 400 com errors de stock detalhados
        const body = err.body as { errors?: { productId: string; reason: string }[] } | null;
        if (err.status === 400 && body?.errors?.length) {
          setStockErrors(body.errors);
        }
        const msg =
          err.status === 409
            ? "Pedido já em processamento. Aguarde alguns instantes."
            : err.status === 422
              ? err.message || "Não foi possível processar o pedido."
              : err.message || "Erro ao criar pedido.";
        setSubmitError(msg);
        toast({ title: "Erro no pedido", description: msg, variant: "destructive" });
      } else {
        const msg = (err as Error)?.message || "Erro inesperado.";
        setSubmitError(msg);
        toast({ title: "Erro no pedido", description: msg, variant: "destructive" });
      }
      // Cartão: o Brick precisa da REJEIÇÃO da promise pra reabilitar o form e
      // deixar o cliente tentar de novo (ex.: recusa 422 → outro cartão/parcela).
      if (cardData) throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit do cartão vem do botão do próprio Brick. O aceite dos termos gateia
  // AQUI: se não marcado, REJEITA a promise → o Brick reabilita o form e NENHUM
  // pedido é criado. O bump já foi decidido na entrada da etapa (acceptedBump).
  const handleCardSubmit = async (cardData: OrderCardPayload) => {
    if (!acceptTerms) {
      const termsCheckbox = document.getElementById("accept-terms");
      termsCheckbox?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast({
        title: "Aceite os termos",
        description:
          "Marque o aceite dos termos de uso para concluir o pagamento com cartão.",
        variant: "destructive",
      });
      throw new Error("terms-not-accepted");
    }
    return submitOrder(acceptedBump, cardData);
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate("/carrinho");
  };

  const handleStepSubmit = () => {
    const form = document.querySelector("form");
    if (form) {
      const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) submitButton.click();
    }
  };

  // Render nothing while redirecting (all hooks must run before any return)
  if (items.length === 0) {
    return null;
  }

  const stepVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 32 : -32,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -32 : 32,
      transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] },
    }),
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ContactStep data={contactData || undefined} onSubmit={handleContactSubmit} />;
      case 1:
        return (
          <ShippingStep
            data={shippingData || undefined}
            onSubmit={handleShippingSubmit}
            quotes={shippingQuotes}
            isQuoting={isQuotingShipping}
            onCepChange={setQuoteCep}
            freeShippingThreshold={shippingFree.threshold}
            amountToFreeShipping={shippingFree.amount}
          />
        );
      case 2:
        return (
          contactData &&
          shippingData && (
            <OrderReview
              contact={contactData}
              shipping={shippingData}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              shippingPrice={chosenShippingPrice}
              acceptTerms={acceptTerms}
              onAcceptTerms={setAcceptTerms}
              bumpItem={bumpSummaryItem}
              mpConfigured={mpConfigured}
              payerEmail={contactData.email || undefined}
              onCardSubmit={handleCardSubmit}
            />
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Aurora */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="aurora-blob"
          style={{ width: 400, height: 400, left: "5%", top: "15%", background: "var(--aurora-gold)", opacity: 0.5 }}
        />
        <div
          className="aurora-blob"
          style={{ width: 350, height: 350, right: "5%", bottom: "25%", background: "var(--aurora-amber)", animationDelay: "-4s", opacity: 0.4 }}
        />
      </div>

      <main className="relative pt-28 pb-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto mb-8">
            <Link
              to="/carrinho"
              className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
                transition-colors duration-200 font-body text-sm group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Voltar ao carrinho
            </Link>
          </div>

          <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                Finalizar Compra
              </h1>

              {/* Steps Indicator */}
              <CheckoutSteps currentStep={currentStep} steps={steps} />

              {/* Step Content */}
              <div className="glass rounded-2xl p-6 md:p-8 mb-6 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Order Summary */}
              <div className="lg:hidden mb-6">
                <OrderSummarySticky shipping={chosenShippingPrice} bumpItem={bumpSummaryItem} />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleBack}
                  className="group glass rounded-xl px-5 py-3 text-sm font-body font-medium
                    text-muted-foreground border border-[var(--glass-border)]
                    hover:border-gold/30 hover:text-foreground
                    flex items-center gap-2
                    transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  {currentStep === 0 ? "Voltar" : "Anterior"}
                </button>

                {currentStep < 2 ? (
                  <button
                    onClick={handleStepSubmit}
                    className="shine-effect group bg-gradient-gold text-[#080808]
                      font-body font-bold py-3 px-6 rounded-xl text-sm tracking-wide
                      flex items-center gap-2
                      hover:-translate-y-0.5 hover:shadow-gold-md
                      transition-all duration-250 ease-expo-out"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                ) : paymentMethod === "card" && mpConfigured ? (
                  // Cartão: o pagamento é confirmado pelo botão do próprio Brick.
                  <span className="text-sm text-muted-foreground font-body text-right max-w-[16rem]">
                    Preencha os dados do cartão acima para concluir o pagamento.
                  </span>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={!acceptTerms || isSubmitting}
                    className={cn(
                      "shine-effect group bg-gradient-gold text-[#080808]",
                      "font-body font-bold py-3 px-8 rounded-xl text-sm tracking-wide",
                      "flex items-center gap-2",
                      "hover:-translate-y-0.5 hover:shadow-gold-md",
                      "transition-all duration-250 ease-expo-out",
                      "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    )}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isSubmitting ? "Processando..." : "Confirmar Pedido"}
                  </button>
                )}
              </div>

              {bump && (
                <CheckoutBumpModal
                  bump={bump}
                  isOpen={bumpModalOpen}
                  onAccept={handleBumpAccept}
                  onDecline={handleBumpDecline}
                />
              )}

              {/* Stock / submit errors */}
              {stockErrors && stockErrors.length > 0 && (
                <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-body text-destructive">
                  <p className="font-semibold mb-1">Itens indisponíveis:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {stockErrors.map((e) => {
                      const it = items.find((x) => x.product.id === e.productId);
                      return (
                        <li key={e.productId}>
                          {it ? it.product.name : e.productId} — {e.reason}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              {submitError && !stockErrors && (
                <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-body text-destructive">
                  {submitError}
                </div>
              )}

              {/* Security note */}
              <p className="text-center text-xs text-muted-foreground/40 font-body mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                Pagamento 100% seguro e criptografado
              </p>
            </div>

            {/* Right Column - Order Summary */}
            <div className="hidden lg:block lg:col-span-1">
              <OrderSummarySticky shipping={chosenShippingPrice} bumpItem={bumpSummaryItem} />
              {isQuotingShipping && (
                <p className="mt-2 text-xs text-muted-foreground/60 font-body text-center">
                  Calculando frete...
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
