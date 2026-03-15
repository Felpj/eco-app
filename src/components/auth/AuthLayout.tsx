import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div
          className="aurora-blob"
          style={{ width: 500, height: 500, left: "15%", top: "10%", background: "var(--aurora-gold)" }}
        />
        <div
          className="aurora-blob"
          style={{ width: 400, height: 400, right: "10%", bottom: "15%", background: "var(--aurora-amber)", animationDelay: "-5s" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="flex items-center justify-center gap-2 mb-8">
            <span className="font-display text-2xl font-bold text-gradient-gold">ESSENCE</span>
            <span className="font-display text-2xl font-light text-foreground/80">Árabe</span>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-2xl border border-[var(--glass-border)] p-8 shadow-card"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2 text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground font-body text-center text-sm mb-8">
              {subtitle}
            </p>
          )}

          {/* Social proof */}
          <div className="glass-gold rounded-xl p-4 mb-6 text-center border border-gold/15">
            <p className="text-sm text-foreground font-body">
              <strong className="text-gold">+2.500</strong> pedidos entregues
            </p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              Junte-se a milhares de clientes satisfeitos
            </p>
          </div>

          {children}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center text-xs text-muted-foreground/50 font-body mt-6"
        >
          Ao continuar, você concorda com nossos{" "}
          <Link to="#" className="text-gold/70 hover:text-gold transition-colors">
            termos de uso
          </Link>{" "}
          e{" "}
          <Link to="#" className="text-gold/70 hover:text-gold transition-colors">
            política de privacidade
          </Link>
        </motion.p>
      </div>
    </div>
  );
};
