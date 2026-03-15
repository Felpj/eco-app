export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  audience: "Masculino" | "Feminino" | "Unissex";
  size_ml: number;
  inspired_by: string | null;
  tags: string[];
  price_brl: number;
  cost_usd: number | null;
  wholesale_usd: number | null;
  stock: number;
  availability: "in_stock" | "out_of_stock";
  is_best_seller: boolean;
  is_new: boolean;
  rating: number;
  reviews_count: number;
  image: string;
}

const USD_BRL = 5.20;

function roundTo9(value: number): number {
  const base = Math.round(value / 10) * 10;
  return base - 1;
}

function generateSlug(name: string, brand: string): string {
  return `${name}-${brand}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function calculatePrice(costUsd: number | null, brand: string, name: string): number {
  if (costUsd !== null) {
    return roundTo9(costUsd * USD_BRL * 2.6);
  }
  
  // Fallback pricing by category
  const nameLower = name.toLowerCase();
  const brandLower = brand.toLowerCase();
  
  if (nameLower.includes("club de nuit") || brandLower.includes("orientica")) {
    return 399;
  }
  if (brandLower.includes("lattafa")) {
    return 279;
  }
  return 349;
}

function generateRating(): { rating: number; reviews_count: number } {
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9];
  return {
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    reviews_count: Math.floor(Math.random() * 800) + 100
  };
}

const rawProducts = [
  {"name":"Club de Nuit Iconic","brand":"ARMAF","audience":"Masculino","size_ml":105,"inspired_by":"Bleu de Chanel","cost_usd":null,"wholesale_usd":null,"stock":0,"availability":"out_of_stock","is_best_seller":true,"tags":["azul","versatil","fresco"]},
  {"name":"Club de Nuit Intense","brand":"ARMAF","audience":"Masculino","size_ml":105,"inspired_by":"Aventus","cost_usd":null,"wholesale_usd":null,"stock":0,"availability":"out_of_stock","is_best_seller":true,"tags":["assinatura","frutado","amadeirado"]},
  {"name":"Club de Nuit Milestone","brand":"ARMAF","audience":"Unissex","size_ml":105,"inspired_by":"Millesime Imperial","cost_usd":30.00,"wholesale_usd":28.00,"stock":9,"availability":"in_stock","is_best_seller":true,"tags":["marinho","fresco","luxo"]},
  {"name":"Club de Nuit Precieux I.","brand":"ARMAF","audience":"Unissex","size_ml":55,"inspired_by":"Aventus Absolu","cost_usd":38.00,"wholesale_usd":36.00,"stock":6,"availability":"in_stock","is_best_seller":false,"tags":["assinatura","premium","amadeirado"]},
  {"name":"Club de Nuit Urban Elixir","brand":"ARMAF","audience":"Masculino","size_ml":105,"inspired_by":"Sauvage","cost_usd":30.00,"wholesale_usd":28.00,"stock":12,"availability":"in_stock","is_best_seller":true,"tags":["noite","versatil","aromatico"]},
  {"name":"Yum Yum","brand":"ARMAF","audience":"Feminino","size_ml":100,"inspired_by":"Very Good Girl","cost_usd":37.00,"wholesale_usd":35.00,"stock":7,"availability":"in_stock","is_best_seller":false,"tags":["doce","feminino","noite"]},
  {"name":"Khamrah","brand":"LATTAFA","audience":"Unissex","size_ml":100,"inspired_by":"Angel's Share","cost_usd":20.00,"wholesale_usd":18.00,"stock":15,"availability":"in_stock","is_best_seller":true,"tags":["gourmand","doce","noite"]},
  {"name":"Khamrah Qahwa","brand":"LATTAFA","audience":"Unissex","size_ml":100,"inspired_by":null,"cost_usd":22.00,"wholesale_usd":20.00,"stock":8,"availability":"in_stock","is_best_seller":true,"tags":["cafe","gourmand","noite"]},
  {"name":"Asad","brand":"LATTAFA","audience":"Masculino","size_ml":100,"inspired_by":"Sauvage Elixir","cost_usd":20.00,"wholesale_usd":18.00,"stock":10,"availability":"in_stock","is_best_seller":true,"tags":["especiado","noite","intenso"]},
  {"name":"Fakhar Black","brand":"LATTAFA","audience":"Masculino","size_ml":100,"inspired_by":"Y Eau de Parfum","cost_usd":20.00,"wholesale_usd":18.00,"stock":11,"availability":"in_stock","is_best_seller":false,"tags":["fresco","versatil","aromatico"]},
  {"name":"Yara","brand":"LATTAFA","audience":"Feminino","size_ml":100,"inspired_by":"Poison Girl","cost_usd":18.00,"wholesale_usd":15.00,"stock":9,"availability":"in_stock","is_best_seller":true,"tags":["doce","cremoso","feminino"]},
  {"name":"Yara Moi","brand":"LATTAFA","audience":"Feminino","size_ml":100,"inspired_by":"Marc Jacobs Perfect Intense","cost_usd":20.00,"wholesale_usd":18.00,"stock":6,"availability":"in_stock","is_best_seller":false,"tags":["feminino","elegante","doce"]},
  {"name":"Badee Noble Blush","brand":"LATTAFA","audience":"Feminino","size_ml":100,"inspired_by":"Good Girl Blush","cost_usd":20.00,"wholesale_usd":18.00,"stock":13,"availability":"in_stock","is_best_seller":false,"tags":["floral","feminino","noite"]},
  {"name":"Ana A. Rouge","brand":"LATTAFA","audience":"Feminino","size_ml":60,"inspired_by":"Baccarat Rouge 540 Extrait","cost_usd":15.00,"wholesale_usd":13.00,"stock":5,"availability":"in_stock","is_best_seller":false,"tags":["baccarat","ambarado","doce"]},
  {"name":"Ana Abiyedh","brand":"LATTAFA","audience":"Feminino","size_ml":60,"inspired_by":"Erba Pura","cost_usd":null,"wholesale_usd":null,"stock":0,"availability":"out_of_stock","is_best_seller":false,"tags":["frutado","erba_pura","unissex"]},
  {"name":"Al Nashama Caprice","brand":"LATTAFA","audience":"Unissex","size_ml":100,"inspired_by":"Bleu Electrique","cost_usd":22.00,"wholesale_usd":20.00,"stock":7,"availability":"in_stock","is_best_seller":false,"tags":["azul","noite","versatil"]},
  {"name":"Al Noble Safeer","brand":"LATTAFA","audience":"Unissex","size_ml":100,"inspired_by":"Oud for Happiness","cost_usd":22.00,"wholesale_usd":20.00,"stock":8,"availability":"in_stock","is_best_seller":false,"tags":["oud","amadeirado","premium"]},
  {"name":"Royal Blue","brand":"ORIENTICA","audience":"Masculino","size_ml":80,"inspired_by":"Layton","cost_usd":59.00,"wholesale_usd":null,"stock":6,"availability":"in_stock","is_best_seller":true,"tags":["premium","noite","versatil"]},
  {"name":"Luxury Royal Amber","brand":"ORIENTICA","audience":"Unissex","size_ml":80,"inspired_by":"Erba Pura","cost_usd":50.00,"wholesale_usd":null,"stock":5,"availability":"in_stock","is_best_seller":true,"tags":["frutado","premium","assinatura"]},
  {"name":"Velvet Gold","brand":"ORIENTICA","audience":"Feminino","size_ml":80,"inspired_by":"Gentle Fluidity Gold","cost_usd":59.00,"wholesale_usd":null,"stock":7,"availability":"in_stock","is_best_seller":false,"tags":["elegante","feminino","premium"]},
  {"name":"Amber Noir","brand":"ORIENTICA","audience":"Unissex","size_ml":80,"inspired_by":"Santal 33","cost_usd":null,"wholesale_usd":null,"stock":0,"availability":"out_of_stock","is_best_seller":false,"tags":["amadeirado","santal","unissex"]},
  {"name":"Amber Rouge","brand":"ORIENTICA","audience":"Feminino","size_ml":80,"inspired_by":"Baccarat Rouge 540 Extrait","cost_usd":null,"wholesale_usd":null,"stock":0,"availability":"out_of_stock","is_best_seller":true,"tags":["baccarat","doce","premium"]},
  {"name":"Watani Purple","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Feminino","size_ml":100,"inspired_by":"Giorgio Armani Sì","cost_usd":18.00,"wholesale_usd":15.00,"stock":10,"availability":"in_stock","is_best_seller":false,"tags":["elegante","feminino","dia"]},
  {"name":"Shagaf Al Ward","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Feminino","size_ml":100,"inspired_by":"Good Girl Blush","cost_usd":18.00,"wholesale_usd":15.00,"stock":12,"availability":"in_stock","is_best_seller":false,"tags":["floral","feminino","noite"]},
  {"name":"Durrat Al Aroos","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Feminino","size_ml":85,"inspired_by":"Erba Pura","cost_usd":18.00,"wholesale_usd":15.00,"stock":9,"availability":"in_stock","is_best_seller":true,"tags":["frutado","erba_pura","doce"]},
  {"name":"Ameerati","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Feminino","size_ml":100,"inspired_by":"Roberto Cavalli","cost_usd":18.00,"wholesale_usd":15.00,"stock":8,"availability":"in_stock","is_best_seller":false,"tags":["feminino","assinatura","noite"]},
  {"name":"Royal Blend","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Unissex","size_ml":100,"inspired_by":"Angel's Share","cost_usd":null,"wholesale_usd":null,"stock":0,"availability":"out_of_stock","is_best_seller":true,"tags":["gourmand","doce","noite"]},
  {"name":"Spectre Ghost","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Masculino","size_ml":80,"inspired_by":"Ani (Nishane)","cost_usd":36.00,"wholesale_usd":33.00,"stock":7,"availability":"in_stock","is_best_seller":false,"tags":["especiado","premium","noite"]},
  {"name":"Vulcan Feu","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Unissex","size_ml":100,"inspired_by":null,"cost_usd":38.00,"wholesale_usd":36.00,"stock":6,"availability":"in_stock","is_best_seller":false,"tags":["premium","amadeirado","assinatura"]},
  {"name":"Vulcan Sable","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Unissex","size_ml":100,"inspired_by":null,"cost_usd":32.00,"wholesale_usd":30.00,"stock":8,"availability":"in_stock","is_best_seller":false,"tags":["amadeirado","versatil","premium"]},
  {"name":"Veneno Bianco","brand":"AL WATANIAH / FRENCH AVENUE","audience":"Unissex","size_ml":100,"inspired_by":null,"cost_usd":38.00,"wholesale_usd":36.00,"stock":5,"availability":"in_stock","is_best_seller":false,"tags":["premium","noite","intenso"]}
] as const;

import { getProductImage } from "./productImages";

export const products: Product[] = rawProducts.map((raw, index) => {
  const { rating, reviews_count } = generateRating();
  return {
    id: String(index + 1),
    slug: generateSlug(raw.name, raw.brand),
    name: raw.name,
    brand: raw.brand,
    audience: raw.audience as "Masculino" | "Feminino" | "Unissex",
    size_ml: raw.size_ml,
    inspired_by: raw.inspired_by,
    tags: [...raw.tags],
    price_brl: calculatePrice(raw.cost_usd, raw.brand, raw.name),
    cost_usd: raw.cost_usd,
    wholesale_usd: raw.wholesale_usd,
    stock: raw.stock,
    availability: raw.availability as "in_stock" | "out_of_stock",
    is_best_seller: raw.is_best_seller,
    is_new: index >= rawProducts.length - 3, // Last 3 products are "new"
    rating,
    reviews_count,
    image: getProductImage(raw.name, raw.brand)
  };
});

export const brands = [...new Set(products.map(p => p.brand))];
export const audiences = ["Masculino", "Feminino", "Unissex"] as const;
export const sizes = [...new Set(products.map(p => p.size_ml))].sort((a, b) => a - b);

export const collections = [
  { id: "aventus", label: "Aventus vibes", tags: ["assinatura", "frutado"] },
  { id: "azul", label: "Azul versátil", tags: ["azul", "fresco", "versatil"] },
  { id: "gourmand", label: "Doces gourmands", tags: ["gourmand", "doce"] },
  { id: "baccarat", label: "Baccarat DNA", tags: ["baccarat"] },
  { id: "erba", label: "Erba Pura style", tags: ["erba_pura", "frutado"] },
  { id: "noite", label: "Ultra Male noite", tags: ["noite", "intenso"] },
  { id: "femininos", label: "Femininos elegantes", tags: ["feminino", "elegante"] }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
