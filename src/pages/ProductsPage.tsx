import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, AlertCircle } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/money";

const ProductsPage = () => {
  const { data, loading, error, reload } = useProducts({ page: 1, limit: 12, sort: "best_seller" });
  const products = data?.items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-12 bg-gradient-dark">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Nossa <span className="text-gradient-gold">Coleção</span>
              </h1>
              <p className="text-muted-foreground font-body max-w-2xl mx-auto">
                Fragrâncias exclusivas inspiradas nos melhores perfumes de nicho do mundo.
                Qualidade premium, preço justo.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {error ? (
              <div className="glass rounded-2xl p-8 flex flex-col items-center text-center gap-3 border border-destructive/30 max-w-md mx-auto">
                <AlertCircle className="w-6 h-6 text-destructive" />
                <p className="text-sm text-muted-foreground font-body">
                  Não foi possível carregar os produtos. Tente recarregar.
                </p>
                <Button variant="outline" size="sm" onClick={reload}>
                  Tentar novamente
                </Button>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-6 w-2/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-8 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => {
                  const badge = product.is_best_seller
                    ? "Mais Vendido"
                    : product.is_new
                    ? "Novo"
                    : null;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/produto/${product.slug}`}>
                        <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
                          {/* Image */}
                          <div className="relative aspect-square bg-gradient-dark overflow-hidden">
                            <ProductImage
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {badge && (
                              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-body font-semibold">
                                {badge}
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="p-6">
                            <div className="flex items-center gap-1 mb-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(product.rating)
                                      ? "fill-primary text-primary"
                                      : "text-muted"
                                  }`}
                                />
                              ))}
                              <span className="text-muted-foreground text-xs font-body ml-1">
                                ({product.reviews_count})
                              </span>
                            </div>

                            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-[0.2em] mb-1">
                              {product.brand}
                            </p>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            {product.inspired_by && (
                              <p className="text-muted-foreground text-sm font-body mb-2">
                                Inspirado em {product.inspired_by}
                              </p>
                            )}

                            <div className="flex items-center gap-2 mb-4">
                              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-body">
                                {product.audience}
                              </span>
                              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-body">
                                {product.size_ml}ml
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-foreground font-display text-2xl font-bold">
                                {formatMoney(product.price_brl)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductsPage;
