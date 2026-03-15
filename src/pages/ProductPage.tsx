import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Check, Truck, Shield, Minus, Plus, MessageCircle, ChevronDown } from "lucide-react";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { getProductImages } from "@/data/productImages";
import { UpsellShelf } from "@/components/upsell/UpsellShelf";
import { ProductReviews } from "@/components/catalog/ProductReviews";
import { InspirationBlock } from "@/components/catalog/InspirationBlock";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TestimonialsSection from "@/components/TestimonialsSection";
import { getProductBySlug, getProductById, products } from "@/data/products";
import { getScentNotes } from "@/data/productScentNotes";
import { getProductDescription } from "@/data/productDescriptions";
import { formatMoney, calculateInstallment } from "@/lib/money";

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Resolve por slug ou por id numérico (links antigos)
  const param = slug ?? "";
  const product =
    getProductBySlug(param) ?? (/\d+/.test(param) ? getProductById(param) : undefined) ?? null;

  if (!product) {
    navigate("/catalogo");
    return null;
  }

  const isOutOfStock = product.availability === "out_of_stock";
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const installment = calculateInstallment(product.price_brl);
  const notes = getScentNotes(product.slug);
  const galleryImages = getProductImages(product.name, product.brand);
  const description = getProductDescription(product.slug);

  const handleWhatsApp = () => {
    const message = `Olá! Tenho interesse no perfume ${product.name} (${product.brand}) - R$ ${product.price_brl}`;
    window.open(`https://wa.me/5518996718769?text=${encodeURIComponent(message)}`, "_blank");
  };

  // SEO
  useEffect(() => {
    document.title = `${product.name} — ${product.brand} | ESSENCE Árabe`;
    return () => {
      document.title = "ESSENCE Árabe — Perfumaria Árabe Autêntica";
    };
  }, [product.name, product.brand]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-body text-muted-foreground mb-10">
            <Link to="/catalogo" className="hover:text-gold transition-colors duration-200">
              Catálogo
            </Link>
            <span>/</span>
            <span className="text-gold/80">{product.brand}</span>
            <span>/</span>
            <span className="text-foreground truncate max-w-[180px]">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">

            {/* ── Imagem do produto ── */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="sticky top-24">
                <div className="relative aspect-square max-w-lg mx-auto">
                  {/* Glow cinematográfico */}
                  <div
                    className="absolute inset-[-15%] rounded-full pointer-events-none blur-[80px]"
                    style={{ background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 65%)" }}
                    aria-hidden="true"
                  />

                  {/* Galeria */}
                  <div className="relative z-10">
                    <ProductGallery
                      images={galleryImages}
                      alt={product.name}
                      overlay={
                        isOutOfStock ? (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                            <span className="glass-gold px-6 py-3 rounded-xl text-gold font-display font-semibold">
                              Esgotado
                            </span>
                          </div>
                        ) : undefined
                      }
                    />
                  </div>

                  {/* Badges */}
                  {product.is_best_seller && (
                    <div className="absolute top-4 left-4 z-20 bg-gradient-gold text-[#080808]
                      px-3 py-1.5 rounded-full text-xs font-body font-bold tracking-wide
                      animate-pulse-gold">
                      Mais Vendido
                    </div>
                  )}
                  {isLowStock ? (
                    <div className="absolute top-4 right-4 z-20 bg-amber-500/90 text-white
                      px-3 py-1.5 rounded-full text-xs font-body font-bold tracking-wide
                      animate-pulse-gold">
                      Últimas unidades
                    </div>
                  ) : product.is_new ? (
                    <div className="absolute top-4 right-4 z-20 bg-emerald-600/90 text-white
                      px-3 py-1.5 rounded-full text-xs font-body font-bold tracking-wide">
                      Novo
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>

            {/* ── Informações ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6"
            >
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm font-body">
                  {product.rating} · ({product.reviews_count} avaliações)
                </span>
              </div>

              {/* Nome e marca */}
              <div>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.2em] mb-1">
                  {product.brand}
                </p>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Inspirado em — destaque de venda */}
              <InspirationBlock product={product} />

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="glass rounded-lg px-3 py-1.5 text-sm font-body text-muted-foreground">
                  {product.audience}
                </span>
                <span className="glass-gold rounded-lg px-3 py-1.5 text-sm font-body text-gold">
                  {product.size_ml}ml
                </span>
                {product.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="glass rounded-lg px-3 py-1.5 text-sm font-body text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Notas olfativas */}
              <div>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.25em] font-body mb-3">
                  Pirâmide Olfativa
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { layer: "Topo", notes: notes.top },
                    { layer: "Coração", notes: notes.heart },
                    { layer: "Fundo", notes: notes.base },
                  ].map(({ layer, notes: n }) => (
                    <div key={layer} className="glass rounded-xl p-3 text-center">
                      <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{layer}</p>
                      <p className="text-sm text-gold font-body font-medium mt-1">{n.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {[
                  "Fixação de até 14 horas na pele",
                  "Projeção moderada a forte",
                  "Fórmula árabe concentrada",
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/15 border border-gold/25
                      flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-gold" />
                    </div>
                    <span className="text-foreground/85 font-body text-sm">{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Descrição expandível */}
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="w-full glass rounded-xl p-4 flex items-center justify-between
                  hover:border-gold/20 transition-colors duration-200 data-[state=open]:border-gold/20
                  [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180">
                  <span className="text-sm font-body font-medium text-foreground">Descrição completa</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="mt-3 text-muted-foreground text-editorial text-sm leading-relaxed">
                    {description}
                  </p>
                </CollapsibleContent>
              </Collapsible>

              {/* Preço */}
              <div className="glass rounded-2xl p-5 border border-[rgba(201,168,76,0.15)]">
                <p className="text-gold/70 text-xs font-body uppercase tracking-wide mb-1">Preço</p>
                <span className="font-display text-4xl font-bold text-foreground">
                  {formatMoney(product.price_brl)}
                </span>
                <p className="text-muted-foreground text-sm font-body mt-1">
                  ou 12x de {formatMoney(installment)} sem juros
                </p>
              </div>

              {/* Quantidade + CTA */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-0 glass rounded-xl overflow-hidden border border-[var(--glass-border)]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={isOutOfStock}
                      aria-label="Diminuir quantidade"
                      className="w-12 h-14 flex items-center justify-center text-muted-foreground
                        hover:text-gold hover:bg-gold/5 transition-colors duration-200
                        disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-foreground font-body font-semibold text-lg w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={isOutOfStock}
                      aria-label="Aumentar quantidade"
                      className="w-12 h-14 flex items-center justify-center text-muted-foreground
                        hover:text-gold hover:bg-gold/5 transition-colors duration-200
                        disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <AddToCartButton
                      product={product}
                      quantity={quantity}
                      variant="gold"
                      size="xl"
                      className="w-full h-14 shine-effect text-sm font-semibold"
                      disabled={isOutOfStock}
                    />
                  </div>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full h-14 glass border border-[var(--glass-border)] rounded-xl
                    flex items-center justify-center gap-2 text-foreground font-body font-semibold
                    hover:border-gold/30 hover:text-gold transition-all duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  Comprar no WhatsApp
                </button>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Truck,   title: "Envio Rápido",  sub: "Até 12h = mesmo dia" },
                  { icon: Shield,  title: "Garantia",       sub: "30 dias para troca" },
                ].map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="glass rounded-xl p-4 flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <span className="text-foreground font-body text-sm font-semibold block">{title}</span>
                      <span className="text-muted-foreground text-xs font-body">{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="mt-24 container mx-auto px-4 max-w-4xl">
          <ProductReviews rating={product.rating} reviewsCount={product.reviews_count} />
        </div>

        {/* Compre junto */}
        <div className="mt-24 container mx-auto px-4">
          <UpsellShelf context="PDP" currentProductId={product.id} />
        </div>

        {/* Testimonials */}
        <div className="mt-24">
          <TestimonialsSection />
        </div>
      </main>
    </div>
  );
};

export default ProductPage;
