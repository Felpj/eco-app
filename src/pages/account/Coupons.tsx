import { Link } from "react-router-dom";
import { ArrowLeft, Ticket, Sparkles } from "lucide-react";

/**
 * Slice 4 — Cupons (Em breve)
 *
 * Pendência backend: não há endpoint pra listar cupons do customer.
 * O endpoint POST /coupons/validate existe (Slice 2) mas só valida códigos
 * digitados no checkout. Substitui o mock zumbi anterior por estado
 * "em breve" honesto.
 */
const Coupons = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/conta"
            className="inline-flex items-center gap-2 text-muted-foreground/60 hover:text-gold
              transition-colors duration-200 mb-8 font-body text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Voltar para conta
          </Link>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            Meus Cupons
          </h1>

          <div className="glass rounded-2xl p-10 border border-[var(--glass-border)] text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl glass-gold border border-gold/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-gold" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Em breve
            </h2>
            <p className="text-muted-foreground/70 font-body text-sm max-w-md mx-auto mb-6">
              Estamos preparando uma área dedicada para você visualizar e
              acompanhar todos os seus cupons disponíveis. Por enquanto, você
              pode aplicar códigos diretamente no carrinho ou checkout.
            </p>

            <div className="glass-gold rounded-xl p-4 max-w-md mx-auto border border-gold/15 flex items-start gap-3 text-left">
              <Ticket className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-foreground/80 font-body">
                Tem um código? Adicione no carrinho ou no checkout, no campo
                "Cupom de desconto".
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Coupons;
