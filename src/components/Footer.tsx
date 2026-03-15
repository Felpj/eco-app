import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Truck, Shield, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#060606] border-t border-[var(--glass-border)]">
      {/* Top ornament */}
      <div className="flex items-center justify-center pt-12 pb-8 px-4">
        <div className="ornament-line text-gold/60 text-xs uppercase tracking-[0.25em] font-body">
          ESSENCE ÁRABE
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Brand block */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group" aria-label="Ir para a página inicial">
            <span className="font-display text-3xl font-bold text-gradient-gold">
              ESSENCE
            </span>
            <span className="font-display text-3xl font-light text-foreground/70">
              Árabe
            </span>
          </Link>
          <p className="text-editorial text-muted-foreground max-w-sm mx-auto mt-3">
            "Fragrâncias que contam histórias do Oriente."
          </p>
          <p className="font-body text-sm text-muted-foreground/60 max-w-md mx-auto mt-2">
            Perfumaria árabe autêntica para o mercado brasileiro. Alta fixação,
            origens nobres, preço acessível.
          </p>
        </div>

        {/* Trust pillars */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: Truck, label: "Envio para todo o Brasil" },
            { icon: Shield, label: "Compra 100% segura" },
            { icon: Phone, label: "Suporte via WhatsApp" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground/70 font-body">
              <Icon className="w-3.5 h-3.5 text-gold/60" />
              {label}
            </div>
          ))}
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12">
          {[
            { href: "/catalogo", label: "Catálogo" },
            { href: "/sobre", label: "Sobre Nós" },
            { href: "/carrinho", label: "Carrinho" },
            { href: "/conta", label: "Minha Conta" },
            { href: "#", label: "Política de Envio" },
            { href: "#", label: "Privacidade" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              to={href}
              className="text-sm font-body text-muted-foreground/60 hover:text-gold transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div className="flex justify-center gap-4 mb-12">
          <a
            href="#"
            aria-label="Instagram da ESSENCE Árabe"
            className="w-10 h-10 glass rounded-full flex items-center justify-center
              text-muted-foreground hover:text-gold hover:border-gold/30
              transition-all duration-200"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/5518996718769?text=Olá! Gostaria de saber mais sobre os perfumes ESSENCE Árabe."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp da ESSENCE Árabe"
            className="w-10 h-10 glass rounded-full flex items-center justify-center
              text-muted-foreground hover:text-gold hover:border-gold/30
              transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="section-ornament mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-body text-muted-foreground/40">
            © 2026 ESSENCE Árabe · Todos os direitos reservados
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-body text-muted-foreground/40">Pagamento seguro</span>
            {["PIX", "VISA", "MC"].map((m) => (
              <div
                key={m}
                className="glass px-2 py-1 rounded text-[9px] font-bold text-muted-foreground/60 tracking-wider"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
