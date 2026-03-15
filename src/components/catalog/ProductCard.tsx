import { motion } from "framer-motion";
import { Star, Eye, MessageCircle, Bell } from "lucide-react";
import { Product } from "@/data/products";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "@/components/commerce/AddToCartButton";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const ProductCard = ({ product, onQuickView, index = 0 }: ProductCardProps) => {
  const isOutOfStock = product.availability === "out_of_stock";
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const installment = Math.ceil(product.price_brl / 12);

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Olá! Tenho interesse no perfume ${product.name} (${product.brand}) - R$ ${product.price_brl}`;
    window.open(`https://wa.me/5518996718769?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className={cn("group", isOutOfStock && "opacity-60")}
    >
      <div
        className={cn(
          "glass rounded-2xl overflow-hidden cursor-pointer",
          "transition-all duration-300 ease-expo-out",
          "hover:-translate-y-1.5 hover:shadow-card-hover",
          "hover:border-[rgba(255,255,255,0.12)]",
        )}
        onClick={() => onQuickView(product)}
      >
        {/* ── Imagem ── */}
        <div className="relative aspect-square bg-[#111] overflow-hidden">
          <ProductImage
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={400}
            height={400}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 ease-expo-out",
              !isOutOfStock && "group-hover:scale-[1.06]",
            )}
          />

          {/* Quick view overlay */}
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
              flex flex-col items-center justify-center gap-3"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="inline-flex items-center gap-2 glass-gold rounded-xl
                px-5 py-2.5 text-gold text-sm font-body font-medium
                hover:bg-[rgba(201,168,76,0.12)] transition-colors"
            >
              <Eye className="w-4 h-4" />
              Ver Detalhes
            </button>
          </div>

          {/* Badges — top left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.is_best_seller && (
              <span className="bg-gradient-gold text-[#080808] px-2.5 py-1
                rounded-full text-[10px] font-body font-bold tracking-wide">
                Mais Vendido
              </span>
            )}
            {product.is_new && (
              <span className="bg-emerald-600/90 text-white px-2.5 py-1
                rounded-full text-[10px] font-body font-bold tracking-wide">
                Novo
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-500/90 text-white px-2.5 py-1
                rounded-full text-[10px] font-body font-bold tracking-wide">
                Últimas unidades
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-destructive/90 text-white px-2.5 py-1
                rounded-full text-[10px] font-body font-bold tracking-wide">
                Esgotado
              </span>
            )}
          </div>
        </div>

        {/* ── Conteúdo ── */}
        <div className="p-4 flex flex-col gap-2">
          {/* Marca */}
          <p className="text-[10px] text-muted-foreground font-body uppercase tracking-[0.2em]">
            {product.brand}
          </p>

          {/* Nome */}
          <h3 className="font-display text-base font-semibold text-foreground
            group-hover:text-gold transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>

          {/* Rating + tamanho */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(product.rating)
                      ? "fill-gold text-gold"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
              <span className="text-muted-foreground text-[10px] font-body ml-1">
                ({product.reviews_count})
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground font-body">
              {product.size_ml}ml
            </span>
          </div>

          {/* Chip "inspirado em" */}
          {product.inspired_by && (
            <span className="inline-block glass rounded-lg px-2 py-1
              text-[10px] text-muted-foreground font-body truncate max-w-full">
              Inspirado em {product.inspired_by}
            </span>
          )}

          {/* Preço */}
          <div className="pt-1">
            <span className="font-display text-xl font-bold text-foreground">
              R$&thinsp;{product.price_brl}
            </span>
            <p className="text-[10px] text-muted-foreground font-body">
              12x de R$&thinsp;{installment}
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            {isOutOfStock ? (
              <button className="w-full glass border border-[rgba(255,255,255,0.1)]
                text-muted-foreground text-sm font-body py-2.5 rounded-xl
                flex items-center justify-center gap-2
                hover:text-gold hover:border-gold/30 transition-colors duration-200">
                <Bell className="w-4 h-4" />
                Avise-me
              </button>
            ) : (
              <>
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-gradient-gold text-[#080808] text-sm
                    font-body font-semibold py-2.5 rounded-xl
                    flex items-center justify-center gap-2
                    hover:-translate-y-0.5 hover:shadow-gold-sm
                    transition-all duration-200 ease-expo-out shine-effect"
                >
                  <MessageCircle className="w-4 h-4" />
                  Comprar no WhatsApp
                </button>
                <div className="flex gap-2 min-w-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
                    className="flex-1 min-w-0 glass text-muted-foreground text-sm font-body py-2
                      rounded-xl hover:text-gold hover:border-gold/20
                      transition-all duration-200 truncate"
                  >
                    Ver detalhes
                  </button>
                  <AddToCartButton
                    product={product}
                    variant="secondary"
                    size="icon"
                    className="shrink-0 glass hover:border-gold/30 hover:text-gold"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
