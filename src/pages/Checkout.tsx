import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { ContactStep, ContactFormData } from "@/components/checkout/ContactStep";
import { ShippingStep, ShippingFormData } from "@/components/checkout/ShippingStep";
import { PaymentStep, PaymentFormData } from "@/components/checkout/PaymentStep";
import { OrderReview } from "@/components/checkout/OrderReview";
import { OrderSummarySticky } from "@/components/checkout/OrderSummarySticky";
import { OrderBumpCard } from "@/components/upsell/OrderBumpCard";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutDraft } from "@/hooks/use-checkout-draft";
import { getEligibleOffers } from "@/data/upsellOffers";
import { cn } from "@/lib/utils";

const steps = [
  { id: "contact", label: "Contato", number: 1 },
  { id: "shipping", label: "Entrega", number: 2 },
  { id: "payment", label: "Pagamento", number: 3 },
  { id: "review", label: "Revisão", number: 4 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal } = useCartStore();
  const { draft, updateDraft, clearDraft } = useCheckoutDraft();
  const cartTotal = getSubtotal();
  const cartProductIds = items.map((item) => item.product.id);

  const orderBumps = getEligibleOffers("CHECKOUT", cartTotal, cartProductIds).filter(
    (o) => o.type === "ORDER_BUMP"
  );
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
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(
    draft?.payment
      ? {
          method: draft.payment.method.toLowerCase() as "pix" | "card",
          addUpsell: draft.orderBump?.enabled || false,
        }
      : null
  );
  const [acceptTerms, setAcceptTerms] = useState(draft?.acceptTerms || false);

  // Redirect empty cart in useEffect (never during render — causes "Cannot update component while rendering")
  useEffect(() => {
    if (items.length === 0) {
      navigate("/carrinho");
    }
  }, [items.length, navigate]);

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

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    setDirection(1);
    setCurrentStep(3);
  };

  useEffect(() => {
    if (contactData || shippingData || paymentData) {
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
        payment: paymentData
          ? { method: paymentData.method.toUpperCase() as "PIX" | "CARD" }
          : undefined,
        orderBump: paymentData
          ? { enabled: paymentData.addUpsell || false }
          : undefined,
        acceptTerms,
      });
    }
  }, [contactData, shippingData, paymentData, acceptTerms, updateDraft]);

  const handleFinalSubmit = () => {
    if (!acceptTerms) {
      const termsCheckbox = document.getElementById("accept-terms");
      if (termsCheckbox) {
        termsCheckbox.scrollIntoView({ behavior: "smooth", block: "center" });
        termsCheckbox.focus();
      }
      return;
    }

    const orderId = `EA-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Date.now()).slice(-4)}`;
    clearCart();
    clearDraft();
    navigate(`/pedido/${orderId}`);
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
        return <ShippingStep data={shippingData || undefined} onSubmit={handleShippingSubmit} />;
      case 2:
        return <PaymentStep data={paymentData || undefined} onSubmit={handlePaymentSubmit} />;
      case 3:
        return (
          contactData && shippingData && paymentData && (
            <>
              <OrderReview
                contact={contactData}
                shipping={shippingData}
                payment={paymentData}
                onAcceptTerms={setAcceptTerms}
              />
              {orderBumps.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--glass-border)]">
                  <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
                    Adicione ao seu pedido
                  </h3>
                  {orderBumps.map((offer) => (
                    <OrderBumpCard
                      key={offer.id}
                      offer={offer}
                      context="CHECKOUT"
                      cartTotal={cartTotal}
                    />
                  ))}
                </div>
              )}
            </>
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
                <OrderSummarySticky
                  shipping={shippingData?.shippingMethod === "express" ? 15 : 10}
                  orderBumpValue={paymentData?.addUpsell ? 29.9 : 0}
                />
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

                {currentStep < 3 ? (
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
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    disabled={!acceptTerms}
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
                    Confirmar Pedido
                  </button>
                )}
              </div>

              {/* Security note */}
              <p className="text-center text-xs text-muted-foreground/40 font-body mt-4 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3 h-3" />
                Pagamento 100% seguro e criptografado
              </p>
            </div>

            {/* Right Column - Order Summary */}
            <div className="hidden lg:block lg:col-span-1">
              <OrderSummarySticky
                shipping={shippingData?.shippingMethod === "express" ? 15 : 10}
                orderBumpValue={paymentData?.addUpsell ? 29.9 : 0}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
