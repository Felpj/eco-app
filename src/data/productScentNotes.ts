/**
 * Notas olfativas por produto (pirâmide olfativa)
 * Fonte: referências das fragrâncias inspiradoras + conhecimento de perfumaria árabe
 */

export interface ScentNotes {
  top: string[];
  heart: string[];
  base: string[];
}

// slug ou id → notas
export const productScentNotes: Record<string, ScentNotes> = {
  "club-de-nuit-iconic-armaf": {
    top: ["Bergamota", "Lavanda", "Gengibre"],
    heart: ["Íris", "Jasmim", "Narciso"],
    base: ["Sândalo", "Cedro", "Musk"],
  },
  "club-de-nuit-intense-armaf": {
    top: ["Bergamota", "Limão", "Maçã"],
    heart: ["Birch", "Jasmim", "Rosa"],
    base: ["Musk", "Âmbar", "Patchouli"],
  },
  "club-de-nuit-milestone-armaf": {
    top: ["Bergamota", "Melão", "Sal"],
    heart: ["Íris", "Jasmim", "Rosa"],
    base: ["Musk", "Âmbar", "Almíscar"],
  },
  "club-de-nuit-precieux-i-armaf": {
    top: ["Bergamota", "Pimenta Rosa", "Lavanda"],
    heart: ["Birch", "Rosa", "Patchouli"],
    base: ["Âmbar", "Musk", "Vetiver"],
  },
  "club-de-nuit-urban-elixir-armaf": {
    top: ["Pimenta", "Lavanda", "Bergamota"],
    heart: ["Gerânio", "Lavanda", "Violeta"],
    base: ["Âmbar", "Musk", "Cedro"],
  },
  "yum-yum-armaf": {
    top: ["Pistache", "Framboesa", "Bergamota"],
    heart: ["Jasmim", "Íris", "Rosa"],
    base: ["Baunilha", "Musk", "Sândalo"],
  },
  "khamrah-lattafa": {
    top: ["Canela", "Noz-moscada", "Rum"],
    heart: ["Flor de laranjeira", "Heliotrópio", "Jasmim"],
    base: ["Âmbar", "Baunilha", "Tonka"],
  },
  "khamrah-qahwa-lattafa": {
    top: ["Café", "Cardamomo", "Canela"],
    heart: ["Rosa", "Jasmim", "Âmbar"],
    base: ["Baunilha", "Musk", "Madeira"],
  },
  "asad-lattafa": {
    top: ["Lavanda", "Pimenta", "Bergamota"],
    heart: ["Gerânio", "Cravo", "Violeta"],
    base: ["Âmbar", "Vetiver", "Cedro"],
  },
  "fakhar-black-lattafa": {
    top: ["Bergamota", "Gengibre", "Sálvia"],
    heart: ["Lavanda", "Gerânio", "Violeta"],
    base: ["Âmbar", "Musk", "Cedro"],
  },
  "yara-lattafa": {
    top: ["Bergamota", "Pêssego", "Framboesa"],
    heart: ["Rosa", "Jasmim", "Íris"],
    base: ["Baunilha", "Musk", "Sândalo"],
  },
  "yara-moi-lattafa": {
    top: ["Bergamota", "Lavanda", "Íris"],
    heart: ["Jasmim", "Rosa", "Tuberosa"],
    base: ["Musk", "Sândalo", "Baunilha"],
  },
  "badee-noble-blush-lattafa": {
    top: ["Pêssego", "Rosa", "Bergamota"],
    heart: ["Rosa", "Íris", "Peônia"],
    base: ["Musk", "Sândalo", "Baunilha"],
  },
  "ana-a-rouge-lattafa": {
    top: ["Açafrão", "Jasmim", "Rosa"],
    heart: ["Âmbar", "Jasmim", "Íris"],
    base: ["Musk", "Cedro", "Baunilha"],
  },
  "ana-abiyedh-lattafa": {
    top: ["Bergamota", "Melão", "Pêssego"],
    heart: ["Jasmim", "Íris", "Lírio"],
    base: ["Musk", "Âmbar", "Sândalo"],
  },
  "al-nashama-caprice-lattafa": {
    top: ["Gengibre", "Lavanda", "Bergamota"],
    heart: ["Lavanda", "Violeta", "Gerânio"],
    base: ["Âmbar", "Musk", "Cedro"],
  },
  "al-noble-safeer-lattafa": {
    top: ["Safran", "Rosa", "Cardamomo"],
    heart: ["Oud", "Rosa", "Jasmim"],
    base: ["Âmbar", "Musk", "Sândalo"],
  },
  "royal-blue-orientica": {
    top: ["Bergamota", "Lavanda", "Cardamomo"],
    heart: ["Lavanda", "Gerânio", "Violeta"],
    base: ["Musk", "Cedro", "Sândalo"],
  },
  "luxury-royal-amber-orientica": {
    top: ["Bergamota", "Melão", "Pêssego"],
    heart: ["Jasmim", "Íris", "Lírio"],
    base: ["Musk", "Âmbar", "Sândalo"],
  },
  "velvet-gold-orientica": {
    top: ["Bergamota", "Baunilha", "Âmbar"],
    heart: ["Jasmim", "Íris", "Rosa"],
    base: ["Musk", "Sândalo", "Baunilha"],
  },
  "amber-noir-orientica": {
    top: ["Cardamomo", "Bergamota", "Lavanda"],
    heart: ["Íris", "Violeta", "Jasmim"],
    base: ["Sândalo", "Cedro", "Musk"],
  },
  "amber-rouge-orientica": {
    top: ["Açafrão", "Jasmim", "Rosa"],
    heart: ["Âmbar", "Jasmim", "Íris"],
    base: ["Musk", "Cedro", "Baunilha"],
  },
  "watani-purple-al-wataniah-french-avenue": {
    top: ["Cassis", "Floral", "Bergamota"],
    heart: ["Rosa", "Íris", "Jasmim"],
    base: ["Baunilha", "Musk", "Sândalo"],
  },
  "shagaf-al-ward-al-wataniah-french-avenue": {
    top: ["Pêssego", "Rosa", "Bergamota"],
    heart: ["Rosa", "Íris", "Peônia"],
    base: ["Musk", "Sândalo", "Baunilha"],
  },
  "durrat-al-aroos-al-wataniah-french-avenue": {
    top: ["Bergamota", "Melão", "Pêssego"],
    heart: ["Jasmim", "Íris", "Lírio"],
    base: ["Musk", "Âmbar", "Sândalo"],
  },
  "ameerati-al-wataniah-french-avenue": {
    top: ["Bergamota", "Floral", "Frutado"],
    heart: ["Rosa", "Jasmim", "Íris"],
    base: ["Musk", "Sândalo", "Baunilha"],
  },
  "royal-blend-al-wataniah-french-avenue": {
    top: ["Canela", "Noz-moscada", "Rum"],
    heart: ["Flor de laranjeira", "Heliotrópio", "Jasmim"],
    base: ["Âmbar", "Baunilha", "Tonka"],
  },
  "spectre-ghost-al-wataniah-french-avenue": {
    top: ["Cardamomo", "Rosa", "Bergamota"],
    heart: ["Rosa", "Oud", "Safran"],
    base: ["Âmbar", "Musk", "Sândalo"],
  },
  "vulcan-feu-al-wataniah-french-avenue": {
    top: ["Bergamota", "Lavanda", "Pimenta"],
    heart: ["Gerânio", "Violeta", "Íris"],
    base: ["Âmbar", "Musk", "Cedro"],
  },
  "vulcan-sable-al-wataniah-french-avenue": {
    top: ["Bergamota", "Lavanda", "Gengibre"],
    heart: ["Gerânio", "Violeta", "Íris"],
    base: ["Âmbar", "Musk", "Vetiver"],
  },
  "veneno-bianco-al-wataniah-french-avenue": {
    top: ["Bergamota", "Floral", "Frutado"],
    heart: ["Jasmim", "Rosa", "Íris"],
    base: ["Musk", "Sândalo", "Âmbar"],
  },
};

// Fallback genérico
const DEFAULT_NOTES: ScentNotes = {
  top: ["Bergamota", "Lavanda"],
  heart: ["Oud", "Lavanda", "Jasmim"],
  base: ["Âmbar", "Baunilha", "Musk"],
};

export function getScentNotes(slug: string): ScentNotes {
  return productScentNotes[slug] ?? DEFAULT_NOTES;
}
