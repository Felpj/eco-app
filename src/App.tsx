import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import SobrePage from "./pages/SobrePage";
import CatalogoPage from "./pages/CatalogoPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecoverPassword from "./pages/RecoverPassword";
import AccountHome from "./pages/account/AccountHome";
import OrdersList from "./pages/account/OrdersList";
import OrderDetails from "./pages/account/OrderDetails";
import Addresses from "./pages/account/Addresses";
import Coupons from "./pages/account/Coupons";
import Referrals from "./pages/account/Referrals";
import Preferences from "./pages/account/Preferences";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// ── Page wrapper com animação de entrada/saída ───────────────────────────────
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -4 },
};
const pageTransition = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

// ── Router com AnimatePresence ───────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/p/:slug" element={<ProductPage />} />
          <Route path="/produto/:slug" element={<ProductPage />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido/:orderId" element={<OrderSuccess />} />
          <Route path="/sobre" element={<SobrePage />} />

          {/* Auth */}
          <Route path="/entrar" element={<Login />} />
          <Route path="/criar-conta" element={<Signup />} />
          <Route path="/recuperar-senha" element={<RecoverPassword />} />

          {/* Protected Account */}
          <Route path="/conta" element={<ProtectedRoute><AccountHome /></ProtectedRoute>} />
          <Route path="/conta/pedidos" element={<ProtectedRoute><OrdersList /></ProtectedRoute>} />
          <Route path="/conta/pedidos/:orderCode" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/conta/enderecos" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
          <Route path="/conta/cupons" element={<ProtectedRoute><Coupons /></ProtectedRoute>} />
          <Route path="/conta/indicacoes" element={<ProtectedRoute><Referrals /></ProtectedRoute>} />
          <Route path="/conta/preferencias" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Layout root com aurora global e noise texture ────────────────────────────
function AppLayout() {
  return (
    <div className="relative min-h-screen bg-[#080808] overflow-x-hidden">
      {/* Noise texture — grão premium sutil */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{ backgroundImage: "url('/noise.svg')", backgroundRepeat: "repeat", backgroundSize: "200px 200px" }}
        aria-hidden="true"
      />

      {/* Aurora blobs globais — luz ambiente muito suave */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Blob gold — canto superior direito */}
        <div
          className="aurora-blob aurora-blob-lg absolute"
          style={{
            top: "-25%",
            right: "-15%",
            width: "600px",
            height: "600px",
            background: "var(--aurora-gold)",
            animationDelay: "0s",
          }}
        />
        {/* Blob âmbar — canto inferior esquerdo */}
        <div
          className="aurora-blob aurora-blob-lg absolute"
          style={{
            bottom: "-30%",
            left: "-20%",
            width: "500px",
            height: "500px",
            background: "var(--aurora-amber)",
            animationDelay: "4s",
          }}
        />
        {/* Blob warm — centro-direita, muito sutil */}
        <div
          className="aurora-blob absolute"
          style={{
            top: "40%",
            right: "10%",
            width: "300px",
            height: "300px",
            background: "var(--aurora-warm)",
            filter: "blur(60px)",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Shell */}
      <Header />
      <main className="relative z-10">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
