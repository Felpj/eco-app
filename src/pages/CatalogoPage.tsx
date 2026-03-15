import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import PromoBar from "@/components/catalog/PromoBar";
import CatalogHeader from "@/components/catalog/CatalogHeader";
import CollectionChips from "@/components/catalog/CollectionChips";
import FilterSidebar, { FilterState } from "@/components/catalog/FilterSidebar";
import FilterDrawer from "@/components/catalog/FilterDrawer";
import ProductCard from "@/components/catalog/ProductCard";
import QuickViewModal from "@/components/catalog/QuickViewModal";
import { ProductGridSkeleton } from "@/components/catalog/ProductSkeleton";
import EmptyState from "@/components/catalog/EmptyState";
import KitsCombos from "@/components/catalog/KitsCombos";
import CatalogFAQ from "@/components/catalog/CatalogFAQ";
import { products, collections, Product } from "@/data/products";
import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultFilters: FilterState = {
  search: "",
  brands: [],
  audiences: [],
  sizes: [],
  inspired_by: "",
  availability: "all",
  priceRange: [0, 1000],
  sortBy: "best_seller"
};

const sortOptions = [
  { value: "best_seller", label: "Mais vendidos" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "newest", label: "Novidades" }
];

const CatalogoPage = () => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle collection change
  const handleCollectionChange = (collectionId: string | null) => {
    setActiveCollection(collectionId);
    // Reset other filters when selecting a collection
    if (collectionId) {
      setFilters(prev => ({
        ...defaultFilters,
        sortBy: prev.sortBy
      }));
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply collection filter
    if (activeCollection) {
      const collection = collections.find(c => c.id === activeCollection);
      if (collection) {
        result = result.filter(p => 
          p.tags.some(tag => collection.tags.includes(tag))
        );
      }
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        (p.inspired_by && p.inspired_by.toLowerCase().includes(searchLower))
      );
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Apply audience filter
    if (filters.audiences.length > 0) {
      result = result.filter(p => filters.audiences.includes(p.audience));
    }

    // Apply size filter
    if (filters.sizes.length > 0) {
      result = result.filter(p => filters.sizes.includes(p.size_ml));
    }

    // Apply inspired_by filter
    if (filters.inspired_by) {
      const searchLower = filters.inspired_by.toLowerCase();
      result = result.filter(p =>
        p.inspired_by && p.inspired_by.toLowerCase().includes(searchLower)
      );
    }

    // Apply availability filter
    if (filters.availability !== "all") {
      result = result.filter(p => p.availability === filters.availability);
    }

    // Apply price range filter
    result = result.filter(p =>
      p.price_brl >= filters.priceRange[0] && p.price_brl <= filters.priceRange[1]
    );

    // Apply sorting
    switch (filters.sortBy) {
      case "best_seller":
        result.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
        break;
      case "price_asc":
        result.sort((a, b) => a.price_brl - b.price_brl);
        break;
      case "price_desc":
        result.sort((a, b) => b.price_brl - a.price_brl);
        break;
      case "newest":
        result.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        break;
    }

    return result;
  }, [filters, activeCollection]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.brands.length > 0) count++;
    if (filters.audiences.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.inspired_by) count++;
    if (filters.availability !== "all") count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    return count;
  }, [filters]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const clearFiltersAndCollection = () => {
    setFilters(defaultFilters);
    setActiveCollection(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <PromoBar />

      <main>
        <CatalogHeader />
        
        <CollectionChips
          activeCollection={activeCollection}
          onCollectionChange={handleCollectionChange}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-[280px] flex-shrink-0">
              <div className="sticky top-32">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <FilterDrawer
                    filters={filters}
                    onFiltersChange={setFilters}
                    activeFiltersCount={activeFiltersCount}
                  />
                  <p className="text-sm text-muted-foreground font-body hidden sm:block">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "perfume" : "perfumes"} encontrados
                  </p>
                </div>

                {/* Sort (desktop) */}
                <div className="hidden lg:flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as FilterState["sortBy"] }))}
                  >
                    <SelectTrigger className="w-[180px] bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {sortOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <ProductGridSkeleton count={8} />
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  onClearFilters={clearFiltersAndCollection}
                  onCollectionClick={handleCollectionChange}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={handleQuickView}
                      index={index}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <KitsCombos />
        <CatalogFAQ />
      </main>


      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </div>
  );
};

export default CatalogoPage;
