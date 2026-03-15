/**
 * Dados enriquecidos por fragrância inspiradora.
 * Usado no InspirationBlock da PDP para valorizar o "Inspirado em".
 */

export interface InspirationMeta {
  /** Preço estimado do original (BRL) para comparação */
  priceEstimate?: string;
  /** Acordes/notas que definem a vibe (chips) */
  accords: string[];
  /** Tagline curta opcional */
  tagline?: string;
}

// Mapeamento por nome exato ou variação (case-insensitive match)
export const inspirationMeta: Record<string, InspirationMeta> = {
  "bleu de chanel": {
    priceEstimate: "R$ 800+",
    accords: ["Cítrico", "Amadeirado", "Versátil"],
    tagline: "A essência azul icônica",
  },
  "aventus": {
    priceEstimate: "R$ 1.200+",
    accords: ["Frutado", "Amadeirado", "Assinatura"],
    tagline: "O clássico dos clássicos",
  },
  "millesime imperial": {
    priceEstimate: "R$ 900+",
    accords: ["Marinho", "Fresco", "Premium"],
    tagline: "Frescura de luxo",
  },
  "aventus absolu": {
    priceEstimate: "R$ 1.400+",
    accords: ["Intenso", "Amadeirado", "Premium"],
    tagline: "A versão mais intensa",
  },
  "sauvage": {
    priceEstimate: "R$ 600+",
    accords: ["Aromático", "Especiado", "Versátil"],
    tagline: "Presença garantida",
  },
  "sauvage elixir": {
    priceEstimate: "R$ 900+",
    accords: ["Especiado", "Intenso", "Noite"],
    tagline: "Potência máxima",
  },
  "very good girl": {
    priceEstimate: "R$ 700+",
    accords: ["Doce", "Floral", "Feminino"],
    tagline: "Doçura sofisticada",
  },
  "angel's share": {
    priceEstimate: "R$ 1.200+",
    accords: ["Gourmand", "Especiado", "Licoroso"],
    tagline: "Whisky e baunilha",
  },
  "y eau de parfum": {
    priceEstimate: "R$ 500+",
    accords: ["Fresco", "Aromático", "Versátil"],
    tagline: "Juventude e energia",
  },
  "poison girl": {
    priceEstimate: "R$ 600+",
    accords: ["Doce", "Cremoso", "Feminino"],
    tagline: "Sedução doce",
  },
  "marc jacobs perfect intense": {
    priceEstimate: "R$ 600+",
    accords: ["Floral", "Elegante", "Feminino"],
    tagline: "Perfeição floral",
  },
  "good girl blush": {
    priceEstimate: "R$ 700+",
    accords: ["Floral", "Feminino", "Noite"],
    tagline: "Rosa e sensualidade",
  },
  "baccarat rouge 540 extrait": {
    priceEstimate: "R$ 1.500+",
    accords: ["Âmbar", "Doce", "Ícone"],
    tagline: "O perfume mais desejado",
  },
  "erba pura": {
    priceEstimate: "R$ 1.000+",
    accords: ["Frutado", "Solar", "Premium"],
    tagline: "Sol em frasco",
  },
  "bleu electrique": {
    priceEstimate: "R$ 700+",
    accords: ["Azul", "Noite", "Versátil"],
    tagline: "Energia elétrica",
  },
  "oud for happiness": {
    priceEstimate: "R$ 1.000+",
    accords: ["Oud", "Amadeirado", "Premium"],
    tagline: "Oud com alegria",
  },
  "layton": {
    priceEstimate: "R$ 1.100+",
    accords: ["Premium", "Noite", "Versátil"],
    tagline: "Luxo oriental",
  },
  "gentle fluidity gold": {
    priceEstimate: "R$ 1.000+",
    accords: ["Elegante", "Baunilha", "Feminino"],
    tagline: "Fluidez dourada",
  },
  "santal 33": {
    priceEstimate: "R$ 1.200+",
    accords: ["Amadeirado", "Sândalo", "Ícone"],
    tagline: "O sândalo cult",
  },
  "giorgio armani sì": {
    priceEstimate: "R$ 600+",
    accords: ["Floral", "Elegante", "Feminino"],
    tagline: "Sim, você pode",
  },
  "roberto cavalli": {
    priceEstimate: "R$ 500+",
    accords: ["Feminino", "Assinatura", "Noite"],
    tagline: "Glamour italiano",
  },
  "ani (nishane)": {
    priceEstimate: "R$ 1.000+",
    accords: ["Especiado", "Premium", "Noite"],
    tagline: "Especiarias de luxo",
  },
};

export function getInspirationMeta(inspiredBy: string | null): InspirationMeta | null {
  if (!inspiredBy?.trim()) return null;
  const key = inspiredBy.toLowerCase().trim();
  return inspirationMeta[key] ?? {
    accords: ["Assinatura", "Premium"],
    tagline: "Mesma vibe. Preço justo.",
  };
}
