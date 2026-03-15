import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Ticket } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockCoupons } from "@/data/mockCoupons";
import { motion } from "framer-motion";

const Coupons = () => {
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado!",
      description: `Cupom ${code} copiado para a área de transferência.`,
    });
  };

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

          {/* Info banner */}
          <div className="glass-gold rounded-xl p-4 mb-8 border border-gold/15">
            <p className="text-sm text-foreground font-body">
              <strong className="text-gold">Dica:</strong> Os cupons devem ser aplicados
              no carrinho ou durante o checkout.
            </p>
          </div>

          {/* Coupons Grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {mockCoupons.map((coupon, i) => (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-xl border border-[var(--glass-border)] p-5
                  hover:border-gold/25 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-xl font-bold text-foreground tracking-wider">
                      {coupon.code}
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-body mt-0.5">
                      {coupon.description}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl glass-gold border border-gold/20
                    flex items-center justify-center shrink-0 ml-3">
                    <Ticket className="w-4.5 h-4.5 text-gold" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] rounded-xl mb-4">
                  <span className="text-xs text-muted-foreground/60 font-body">Desconto</span>
                  <span className="font-display text-xl font-bold text-gold">
                    {coupon.discountType === "PERCENT"
                      ? `${coupon.value}%`
                      : `R$ ${coupon.value.toFixed(2).replace(".", ",")}`}
                  </span>
                </div>

                {coupon.minPurchase && (
                  <p className="text-xs text-muted-foreground/50 font-body mb-3">
                    Compra mínima: R$ {coupon.minPurchase.toLocaleString("pt-BR")}
                  </p>
                )}

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="w-full flex items-center justify-center gap-2 shine-effect bg-gradient-gold
                    text-[#080808] font-body font-bold py-2.5 rounded-xl text-sm
                    hover:-translate-y-0.5 hover:shadow-gold-sm
                    transition-all duration-250 ease-expo-out"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copiar código
                </button>
              </motion.div>
            ))}
          </div>

          {/* How to use */}
          <div className="glass rounded-2xl p-6 border border-[var(--glass-border)]">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              Como usar
            </h2>
            <ol className="space-y-2.5">
              {[
                "Copie o código do cupom",
                "Adicione produtos ao carrinho",
                'No carrinho ou checkout, cole o código e clique em "Aplicar"',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-body text-muted-foreground/70">
                  <span className="w-5 h-5 rounded-full bg-gold/10 border border-gold/20
                    flex items-center justify-center text-gold text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Coupons;
