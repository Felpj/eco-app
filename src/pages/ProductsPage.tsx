import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

// Product images
import productBlue from "@/assets/featured-product.jpg";
import productRose from "@/assets/product-rose.jpg";
import productAmber from "@/assets/product-amber.jpg";
import productPurple from "@/assets/product-purple.jpg";
import productOrange from "@/assets/product-orange.jpg";
import productWhite from "@/assets/product-white.jpg";

const products = [
  {
    id: "1",
    name: "Blue Intense",
    inspiration: "Sauvage Elixir",
    price: 349,
    originalPrice: 1890,
    rating: 4.9,
    reviews: 1247,
    fixation: "14h+",
    type: "Amadeirado Fresco",
    image: productBlue,
    badge: "Mais Vendido",
  },
  {
    id: "2",
    name: "Rose Oud",
    inspiration: "Oud Wood",
    price: 389,
    originalPrice: 2100,
    rating: 4.8,
    reviews: 892,
    fixation: "16h+",
    type: "Oriental Amadeirado",
    image: productRose,
    badge: null,
  },
  {
    id: "3",
    name: "Amber Noir",
    inspiration: "Black Orchid",
    price: 369,
    originalPrice: 1950,
    rating: 4.9,
    reviews: 756,
    fixation: "14h+",
    type: "Oriental Floral",
    image: productAmber,
    badge: "Novo",
  },
  {
    id: "4",
    name: "Velvet Musk",
    inspiration: "Aventus",
    price: 399,
    originalPrice: 2300,
    rating: 4.9,
    reviews: 1089,
    fixation: "12h+",
    type: "Chipre Frutado",
    image: productPurple,
    badge: null,
  },
  {
    id: "5",
    name: "Desert Night",
    inspiration: "Tobacco Vanille",
    price: 359,
    originalPrice: 2050,
    rating: 4.8,
    reviews: 634,
    fixation: "18h+",
    type: "Oriental Especiado",
    image: productOrange,
    badge: null,
  },
  {
    id: "6",
    name: "Crystal White",
    inspiration: "Silver Mountain Water",
    price: 329,
    originalPrice: 1750,
    rating: 4.7,
    reviews: 445,
    fixation: "10h+",
    type: "Fresco Aquático",
    image: productWhite,
    badge: null,
  },
];

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-12 bg-gradient-dark">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/produto/${product.id}`}>
                    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-gold">
                      {/* Image */}
                      <div className="relative aspect-square bg-gradient-dark overflow-hidden">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-body font-semibold">
                            {product.badge}
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-primary text-sm font-body font-semibold">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        </div>
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
                            ({product.reviews})
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm font-body mb-2">
                          Inspirado em {product.inspiration}
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-body">
                            {product.type}
                          </span>
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-body">
                            Fixação {product.fixation}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-muted-foreground line-through text-sm font-body">
                              R$ {product.originalPrice.toLocaleString("pt-BR")}
                            </span>
                            <span className="text-foreground font-display text-2xl font-bold ml-2">
                              R$ {product.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default ProductsPage;
