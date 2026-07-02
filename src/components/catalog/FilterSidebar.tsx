import { useState } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useProductFacets } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface FilterState {
  search: string;
  brands: string[];
  audiences: string[];
  sizes: number[];
  inspired_by: string;
  availability: "all" | "in_stock" | "out_of_stock";
  priceRange: [number, number];
  sortBy: "best_seller" | "price_asc" | "price_desc" | "newest";
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

const sortOptions = [
  { value: "best_seller", label: "Mais vendidos" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "newest", label: "Novidades" }
];

const FilterSidebar = ({ filters, onFiltersChange, onClose, isMobile }: FilterSidebarProps) => {
  // Facets reais do backend (marca/público/tamanho); fallback vazio enquanto carrega.
  const { data: facets } = useProductFacets();
  const brands = facets?.brands.map((b) => b.name) ?? [];
  const audiences = facets?.audiences ?? [];
  const sizes = facets?.sizes ?? [];

  const [openSections, setOpenSections] = useState({
    brand: true,
    audience: true,
    size: false,
    availability: true,
    price: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: "brands" | "audiences" | "sizes", value: string | number) => {
    const current = filters[key] as (string | number)[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated as any);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      brands: [],
      audiences: [],
      sizes: [],
      inspired_by: "",
      availability: "all",
      priceRange: [0, 1000],
      sortBy: "best_seller"
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.brands.length > 0 || 
    filters.audiences.length > 0 || 
    filters.sizes.length > 0 ||
    filters.inspired_by ||
    filters.availability !== "all" ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000;

  return (
    <div className={cn(
      "bg-card border-r border-border h-full overflow-y-auto",
      isMobile ? "p-4" : "p-6"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-foreground">Filtros</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar
            </Button>
          )}
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar perfume..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Sort (mobile only) */}
      {isMobile && (
        <div className="mb-6">
          <label className="text-sm font-medium text-foreground mb-2 block">Ordenar</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter("sortBy", e.target.value as FilterState["sortBy"])}
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Brands */}
      <Collapsible open={openSections.brand} onOpenChange={() => toggleSection("brand")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border">
          <span className="text-sm font-medium text-foreground">Marca</span>
          {openSections.brand ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 space-y-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleArrayFilter("brands", brand)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Audience */}
      <Collapsible open={openSections.audience} onOpenChange={() => toggleSection("audience")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border">
          <span className="text-sm font-medium text-foreground">Público</span>
          {openSections.audience ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 space-y-2">
          {audiences.map(audience => (
            <label key={audience} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.audiences.includes(audience)}
                onCheckedChange={() => toggleArrayFilter("audiences", audience)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {audience}
              </span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Size */}
      <Collapsible open={openSections.size} onOpenChange={() => toggleSection("size")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border">
          <span className="text-sm font-medium text-foreground">Tamanho (ml)</span>
          {openSections.size ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 space-y-2">
          {sizes.map(size => (
            <label key={size} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.sizes.includes(size)}
                onCheckedChange={() => toggleArrayFilter("sizes", size)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {size}ml
              </span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Availability */}
      <Collapsible open={openSections.availability} onOpenChange={() => toggleSection("availability")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border">
          <span className="text-sm font-medium text-foreground">Disponibilidade</span>
          {openSections.availability ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 space-y-2">
          {[
            { value: "all", label: "Todos" },
            { value: "in_stock", label: "Em estoque" },
            { value: "out_of_stock", label: "Esgotados" }
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={filters.availability === opt.value}
                onCheckedChange={() => updateFilter("availability", opt.value as FilterState["availability"])}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border">
          <span className="text-sm font-medium text-foreground">Faixa de preço</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 pt-2">
          <div className="px-1">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
              min={0}
              max={1000}
              step={10}
              className="mb-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>R$ {filters.priceRange[0]}</span>
              <span>R$ {filters.priceRange[1]}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Inspired By */}
      <div className="py-4 border-t border-border">
        <label className="text-sm font-medium text-foreground mb-2 block">Inspirado em</label>
        <Input
          placeholder="Ex: Sauvage, Aventus..."
          value={filters.inspired_by}
          onChange={(e) => updateFilter("inspired_by", e.target.value)}
          className="bg-secondary border-border"
        />
      </div>
    </div>
  );
};

export default FilterSidebar;
