# Redesign eco-app — Vitrines mais cinemáticas (mantendo a identidade)

## Contexto

O `eco-app` (storefront **ESSENCE Árabe**, Vite+React+TS+Tailwind+shadcn) já tem um **design system maduro e coeso**: dark+gold luxo, `Playfair Display`/`Inter`/`Cormorant Garamond`, e um arsenal de efeitos em `src/index.css` (glass, aurora, glow, ornamentos, motion tokens, ~10 keyframes). As páginas-vitrine já usam framer-motion bem calibrado (`ease [0.16,1,0.3,1]`, stagger).

**Objetivo:** dar um "up" **cinemático nas vitrines** (Home + Catálogo + PDP) — as páginas que vendem a marca — **sem trocar a identidade** e **sem tocar em checkout/cart/conta**. Elevação cirúrgica usando o que já existe + 1-2 momentos "uau", como fizemos com o ecossistema na Kyrio.

**Decisões travadas (Felipe):** foco só nas vitrines · plano completo primeiro · identidade 100% preservada (nada de trocar cor/fonte).

## Princípios (não-negociáveis)

- **Preservar:** paleta dark+gold, Playfair/Inter/Cormorant, tokens existentes, toda lógica de negócio/dados.
- **Reusar > criar:** usar `--ease-out-expo`, `glow-*`, `glass*`, `aurora-blob`, `shine-effect`, keyframes já definidos. Tokens novos só se inevitável.
- **Honrar `prefers-reduced-motion`** (já tem o guard global no index.css) em todo efeito novo.
- **Performance:** parallax/scroll via `transform` + `will-change`; nada que cause layout shift. Cuidado com blur custoso em mobile.
- **Sem build novo:** mesma stack, mesmos componentes.

## Arquivo(s)

Escopo = `src/pages/Index.tsx`, `src/pages/CatalogoPage.tsx`, `src/pages/ProductPage.tsx` e os componentes:
`components/HeroSection.tsx`, `FeaturedProduct.tsx`, `BenefitsSection.tsx`, `PhilosophySection.tsx`, `TestimonialsSection.tsx`, `CTASection.tsx`, `Footer.tsx`,
`components/catalog/{ProductCard,ProductGallery,QuickViewModal,CollectionChips,CatalogHeader}.tsx`,
`components/commerce/AddToCartButton.tsx`.
Tokens/keyframes novos (se houver) → `src/index.css`. **Fora do escopo:** `pages/{Cart,Checkout,OrderSuccess}.tsx`, `account/*`, `auth/*`.

---

## Fatia 1 — Hero cinematográfico (o primeiro "uau")

`HeroSection.tsx` — já tem aurora, glass, float, floating cards, scroll indicator. Elevar:
- **Parallax no scroll:** imagem do perfume + blobs aurora deslocam em velocidades diferentes (`useScroll`+`useTransform` do framer, baseado em `transform`). Profundidade sem peso.
- **Cursor-reactive tilt** no frame glass do perfume (rotateX/Y sutil seguindo o mouse, spring) — desktop só.
- **Entrada mais dramática** dos floating cards (`-82%` e avaliação): scale+rotate de entrada em vez de só fade-y.
- **Glow "respirando"** atrás do produto (anima opacity em loop lento) — reforça o halo que já existe.
- Brilho de varredura no título no load (reusar `light-sweep`/`--gradient-shine` sobre o `text-gradient-gold`).

## Fatia 2 — Reveals & ritmo da Home

`Index.tsx` monta 6 seções; padronizar a entrada cinematográfica:
- **Scroll-reveal consistente** (fade-up + blur-in, o mesmo do hero `item`) em Benefits, Philosophy, Testimonials, CTA — timing generoso, stagger por item.
- **Benefits cards:** hover com glow no ícone + leve `brightness`; já têm `-translate-y`.
- **Philosophy:** underline/ornamento que cresce da esquerda ao entrar na viewport; números decorativos com mais presença.
- **Testimonials:** slide-in mais evidente + glow nos avatares no hover.
- **CTASection:** aurora central em camadas concêntricas (mais dramática, responsiva).
- **Footer:** links com underline-reveal (width 0→100%) no hover, igual ao NavLink do Header.

## Fatia 3 — FeaturedProduct + PDP (o produto como herói)

`FeaturedProduct.tsx` e `ProductPage.tsx`/`ProductGallery.tsx`:
- **Orbs de luz gold** girando devagar ao redor do produto destaque (rotação infinita, `prefers-reduced-motion` desliga).
- **Pirâmide olfativa:** cada camada (Topo/Coração/Fundo) entra com stagger up-in ao revelar.
- **Galeria (PDP):** transição entre imagens com cinema-reveal; thumbnails com indicador de posição animado; botões fullscreen com grow-on-hover + teclado ←/→.
- **QuickViewModal:** abrir/fechar com `cinema-reveal` (keyframe já existe) em vez de fade genérico.

## Fatia 4 — Catálogo + micro-interações + QA

`CatalogoPage.tsx`, `ProductCard.tsx`, `CollectionChips.tsx`, `AddToCartButton.tsx`:
- **ProductCard:** potenciar o `shine-effect` (varredura de luz no hover) já presente; glow no badge "Mais Vendido".
- **CollectionChips:** troca de coleção com fade-out/in rápido mantendo scroll.
- **AddToCartButton:** estado `success` com celebração sutil (partícula/check pulse) — visual apenas, não toca a lógica de cart.
- **Filtros:** expand/collapse com stagger cascata leve.
- **QA:** percorrer Home/Catálogo/PDP em desktop e mobile (1440/768/390); validar `prefers-reduced-motion`; conferir 60fps no parallax; **console limpo** (há 1 erro de console hoje — investigar e, se for do escopo, corrigir).

---

## Verificação (rodando, não lendo)

- Dev server: `npm run dev` (porta **8080**, já roda). Abrir `http://localhost:8080`.
- Por fatia: recarregar e sentir as 3 vitrines em desktop + mobile; checar que nada da identidade mudou (cores/fontes), que checkout/conta seguem intactos, e que `prefers-reduced-motion` desliga os efeitos.
- Sanidade: `npm run build` ao final pra garantir que não quebrou tipos/imports.

## Notas / riscos herdados (não são do redesign, mas anotados)

- `hero-perfume.jpg`/`featured-product.jpg` são assets locais; preços do FeaturedProduct são mockados (R$1.890→R$349) — visual, não tocar dado.
- Há 1 erro de console no load atual (a investigar na Fatia 4).
- Screenshots automáticos via Playwright travam neste ambiente (compositor ocupado pela aurora) — verificação visual é manual no navegador.
