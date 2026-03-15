import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/sobre", label: "Sobre" },
];

// ── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const maxScroll = h.scrollHeight - h.clientHeight;
      const pct = maxScroll > 0 ? (h.scrollTop / maxScroll) * 100 : 0;
      const value = Number.isFinite(pct) ? pct : 0;
      setProgress((prev) => (Math.abs(prev - value) < 0.5 ? prev : value));
    };
    update(); // initial
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[1px] overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ── Nav Link ─────────────────────────────────────────────────────────────────
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      to={href}
      className={cn(
        "relative font-body text-sm uppercase tracking-wider transition-colors duration-250",
        "after:absolute after:bottom-[-3px] after:left-1/2 after:right-1/2 after:h-[1px]",
        "after:bg-gold after:transition-all after:duration-300 after:ease-expo-out",
        "hover:text-gold hover:after:left-0 hover:after:right-0",
        active
          ? "text-gold after:left-0 after:right-0"
          : "text-muted-foreground",
      )}
    >
      {label}
    </Link>
  );
}

// ── Cart Badge ────────────────────────────────────────────────────────────────
function CartBadge({ count, scrolled }: { count: number; scrolled: boolean }) {
  const prevCount = useRef(count);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (count > prevCount.current) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1000);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <span
      className={cn(
        "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1",
        "bg-gold text-[#080808] text-[9px] font-bold rounded-full",
        "flex items-center justify-center leading-none",
        pulse && "animate-pulse-gold",
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-[var(--glass-border)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <ScrollProgress />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="flex items-center gap-2 group" aria-label="ESSENCE Árabe — página inicial">
              <span className="font-display text-xl md:text-2xl font-bold text-gradient-gold transition-all duration-300 group-hover:glow-text">
                ESSENCE
              </span>
              <span className="font-display text-xl md:text-2xl font-light text-foreground/80">
                Árabe
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={location.pathname === link.href}
              />
            ))}
          </motion.nav>

          {/* Desktop Actions */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex items-center gap-5"
          >
            <button
              aria-label="Buscar"
              className="text-muted-foreground hover:text-gold transition-colors duration-200 p-1"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/entrar"
              aria-label="Minha conta"
              className="text-muted-foreground hover:text-gold transition-colors duration-200 p-1"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() => navigate("/carrinho")}
              aria-label={`Carrinho com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
              className="relative text-muted-foreground hover:text-gold transition-colors duration-200 p-1"
            >
              <ShoppingBag className="w-5 h-5" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CartBadge count={totalItems} scrolled={scrolled} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => navigate("/carrinho")}
              aria-label={`Carrinho com ${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
              className="relative text-foreground p-1"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <CartBadge count={totalItems} scrolled={scrolled} />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              className="text-foreground p-1"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden glass border-t border-[var(--glass-border)] overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block font-body text-base py-3 px-2 rounded-lg transition-colors duration-200",
                      location.pathname === link.href
                        ? "text-gold bg-gold/5"
                        : "text-foreground hover:text-gold hover:bg-white/5",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22, duration: 0.3 }}
                className="pt-4 mt-2 border-t border-[var(--glass-border)] flex items-center gap-4"
              >
                <Link
                  to="/entrar"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
                >
                  <User className="w-4 h-4" />
                  Minha Conta
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
