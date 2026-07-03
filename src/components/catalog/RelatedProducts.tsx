import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/catalog/ProductCard";
import { getProducts } from "@/lib/api";
import { Product } from "@/data/products";

interface RelatedProductsProps {
  currentProduct: Product;
  title?: string;
}

/**
 * "Compre junto" real: best sellers do mesmo público vindos do back
 * (substitui o UpsellShelf mock, cujos productIds não batiam com os IDs
 * reais e deixava a seção vazia). Some da tela se não houver relacionados.
 */
export const RelatedProducts = ({
  currentProduct,
  title = "Compre junto",
}: RelatedProductsProps) => {
  const navigate = useNavigate();
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    getProducts({
      audience: currentProduct.audience,
      sort: "best_seller",
      limit: 9,
    })
      .then((res) => {
        if (!active) return;
        setRelated(
          res.items.filter((p) => p.id !== currentProduct.id).slice(0, 8),
        );
      })
      .catch(() => {
        if (active) setRelated([]);
      });
    return () => {
      active = false;
    };
  }, [currentProduct.id, currentProduct.audience]);

  if (related.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {related.map((product, index) => (
          <div key={product.id} className="flex-shrink-0 w-64">
            <ProductCard
              product={product}
              index={index}
              onQuickView={(p) => navigate(`/produto/${p.slug}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
