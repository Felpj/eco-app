/**
 * Mapeamento produto (name, brand) → imagem em Perfume-Arabe-fotos
 * Fallback para placeholder quando não houver foto correspondente
 */

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&auto=format";

const BASE = "/Perfume-Arabe-fotos";

// Mapeamento direto: "Product Name|Brand" → [folder, filename]
// Para marcas híbridas (AL WATANIAH / FRENCH AVENUE), alguns produtos estão em CASA AL WATANIAH
const PRODUCT_IMAGE_MAP: Record<string, [string, string]> = {
  // ARMAF (casa aramaf)
  "Club de Nuit Iconic|ARMAF": ["casa aramaf", "CLUB DE NUIT ICONIC MEN(BLEU DE CHANEL) _01.jpg"],
  "Club de Nuit Intense|ARMAF": ["casa aramaf", "CLUB DE NUIT INTENSE MEN(CREED AVENTUS)_01.webp"],
  "Club de Nuit Milestone|ARMAF": [
    "casa aramaf",
    "CLUB DE NUIT MILESTONE UNI(MILLESIME IMPERIAL)_01.webp",
  ],
  "Club de Nuit Precieux I.|ARMAF": [
    "casa aramaf",
    "CLUB DE NUIT PRECIEUX I. UNI(aventus absolu)_01.jpeg",
  ],
  "Club de Nuit Urban Elixir|ARMAF": [
    "casa aramaf",
    "CLUB DE NUIT URBAN ELIXIR MEN(SAUVAGE)_01.webp",
  ],
  "Yum Yum|ARMAF": ["casa aramaf", "YUM YUM FEM(VERY GOOD GIRL)_01.webp"],

  // AL WATANIAH / FRENCH AVENUE — CASA AL WATANIAH
  "Watani Purple|AL WATANIAH / FRENCH AVENUE": [
    "CASA AL WATANIAH",
    "watani purple fem(GIORGIO ARMANI SÌ)_01.jpg",
  ],
  "Shagaf Al Ward|AL WATANIAH / FRENCH AVENUE": [
    "CASA AL WATANIAH",
    "SHAGAF AL WARD(good girl blush) _01.jpg",
  ],
  "Durrat Al Aroos|AL WATANIAH / FRENCH AVENUE": [
    "CASA AL WATANIAH",
    "DURRAT AL AROOS(erba pura)_01.webp",
  ],
  "Ameerati|AL WATANIAH / FRENCH AVENUE": [
    "CASA AL WATANIAH",
    "AMEERATI(ROBERTO CAVALLI) _01.jpg",
  ],

  // AL WATANIAH / FRENCH AVENUE — CASA FRENCH AVENUE
  "Royal Blend|AL WATANIAH / FRENCH AVENUE": [
    "CASA FRENCH AVENUE",
    "ROYAL BLEND UNI(ANGELS SHARE)_01.webp",
  ],
  "Spectre Ghost|AL WATANIAH / FRENCH AVENUE": [
    "CASA FRENCH AVENUE",
    "spectre ghost meN(ANI NISHANE)_01.png",
  ],
  "Vulcan Feu|AL WATANIAH / FRENCH AVENUE": ["CASA FRENCH AVENUE", "VULCAN FEU UNI_01.webp"],
  "Vulcan Sable|AL WATANIAH / FRENCH AVENUE": [
    "CASA FRENCH AVENUE",
    "vulcan sable uni_01.webp",
  ],
  "Veneno Bianco|AL WATANIAH / FRENCH AVENUE": [
    "CASA FRENCH AVENUE",
    "VENENO BIANCO UNI_01.jpg",
  ],
};

// Galeria: produtos com múltiplas fotos [folder, ...filenames]
const PRODUCT_GALLERY: Record<string, [string, ...string[]]> = {
  "Club de Nuit Iconic|ARMAF": ["casa aramaf", "CLUB DE NUIT ICONIC MEN(BLEU DE CHANEL) _01.jpg", "CLUB DE NUIT ICONIC MEN(BLEU DE CHANEL) _02.jpeg", "CLUB DE NUIT ICONIC MEN(BLEU DE CHANEL) _03.webp"],
  "Club de Nuit Intense|ARMAF": ["casa aramaf", "CLUB DE NUIT INTENSE MEN(CREED AVENTUS)_01.webp", "CLUB DE NUIT INTENSE MEN(CREED AVENTUS)_02.jpeg", "CLUB DE NUIT INTENSE MEN(CREED AVENTUS)_03.webp"],
  "Club de Nuit Milestone|ARMAF": ["casa aramaf", "CLUB DE NUIT MILESTONE UNI(MILLESIME IMPERIAL)_01.webp", "CLUB DE NUIT MILESTONE UNI(MILLESIME IMPERIAL)_02.webp", "CLUB DE NUIT MILESTONE UNI(MILLESIME IMPERIAL)_03.webp"],
  "Yum Yum|ARMAF": ["casa aramaf", "YUM YUM FEM(VERY GOOD GIRL)_01.webp", "YUM YUM FEM(VERY GOOD GIRL)_02.jpeg", "YUM YUM FEM(VERY GOOD GIRL)_03.webp"],
  "Durrat Al Aroos|AL WATANIAH / FRENCH AVENUE": ["CASA AL WATANIAH", "DURRAT AL AROOS(erba pura)_01.webp", "DURRAT AL AROOS(erba pura)_02.png", "DURRAT AL AROOS(erba pura)_03.webp", "DURRAT AL AROOS(erba pura)_04.webp"],
  "Shagaf Al Ward|AL WATANIAH / FRENCH AVENUE": ["CASA AL WATANIAH", "SHAGAF AL WARD(good girl blush) _01.jpg", "SHAGAF AL WARD(good girl blush) _02.jpeg", "SHAGAF AL WARD(good girl blush) _03.webp", "SHAGAF AL WARD(good girl blush) _04.webp"],
};

function buildImageUrl(folder: string, filename: string): string {
  return `${BASE}/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
}

export function getProductImage(name: string, brand: string): string {
  const key = `${name}|${brand}`;
  const entry = PRODUCT_IMAGE_MAP[key];
  if (entry) {
    const [folder, filename] = entry;
    return buildImageUrl(folder, filename);
  }
  return PLACEHOLDER;
}

/** Retorna array de URLs de imagens para galeria. Sempre inclui pelo menos a principal. */
export function getProductImages(name: string, brand: string): string[] {
  const key = `${name}|${brand}`;
  const gallery = PRODUCT_GALLERY[key];
  if (gallery) {
    const [folder, ...filenames] = gallery;
    return filenames.map((f) => buildImageUrl(folder, f));
  }
  return [getProductImage(name, brand)];
}

export { PLACEHOLDER };
