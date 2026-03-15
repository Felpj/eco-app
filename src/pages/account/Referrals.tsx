import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Users, Gift, Share2, Package } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Referrals = () => {
  const { profile } = useAuthStore();
  const referralLink = `https://essencearabe.com/ref/${profile?.id || "guest"}`;
  const referralCode = profile?.id ? `REF-${profile.id.slice(-6).toUpperCase()}` : "REF-GUEST";

  const stats = [
    { label: "Cliques", value: 42, icon: Users },
    { label: "Cadastros", value: 8, icon: Gift },
    { label: "Pedidos", value: 3, icon: Package },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Link copiado!", description: "O link de indicação foi copiado para a área de transferência." });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Código copiado!", description: "O código de indicação foi copiado." });
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
            Indique e Ganhe
          </h1>

          {/* Referral Link Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-gold rounded-2xl p-6 border border-gold/20 mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-4 h-4 text-gold" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Seu Link de Indicação
              </h2>
            </div>
            <p className="text-xs text-muted-foreground/60 font-body mb-4">
              Compartilhe este link e ganhe benefícios para cada amigo que comprar
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  value={referralLink}
                  readOnly
                  className="flex-1 glass rounded-xl px-4 py-2.5 text-sm font-body text-muted-foreground/70
                    border border-[var(--glass-border)] focus:outline-none font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="shine-effect flex items-center gap-2 bg-gradient-gold text-[#080808]
                    font-body font-bold py-2.5 px-4 rounded-xl text-sm
                    hover:-translate-y-0.5 hover:shadow-gold-sm
                    transition-all duration-250 ease-expo-out"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copiar
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  value={referralCode}
                  readOnly
                  className="flex-1 glass rounded-xl px-4 py-2.5 text-sm font-body text-gold
                    border border-[var(--glass-border)] focus:outline-none font-mono font-bold tracking-widest"
                />
                <button
                  onClick={handleCopyCode}
                  className="glass rounded-xl px-4 py-2.5 text-sm font-body font-medium
                    text-muted-foreground/60 border border-[var(--glass-border)]
                    hover:border-gold/30 hover:text-gold
                    flex items-center gap-2
                    transition-all duration-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Código
                </button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-xl p-5 border border-[var(--glass-border)] text-center"
                >
                  <div className="w-10 h-10 rounded-xl glass-gold border border-gold/20
                    flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <p className="font-display text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-body">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Benefits */}
          <div className="glass rounded-2xl p-6 border border-[var(--glass-border)]">
            <h2 className="font-display text-lg font-semibold text-foreground mb-5">
              Como Funciona
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Você ganha R$ 10 de desconto",
                  desc: "Para cada amigo que fizer o primeiro pedido usando seu link",
                },
                {
                  title: "Seu amigo ganha frete grátis",
                  desc: "No primeiro pedido usando seu código de indicação",
                },
                {
                  title: "Sem limite de indicações",
                  desc: "Indique quantos amigos quiser e acumule descontos",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20
                    flex items-center justify-center text-gold text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-foreground text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground/60 font-body mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Referrals;
