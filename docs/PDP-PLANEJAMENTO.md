# Página de Produto (PDP) — Planejamento Completo

> PDP = Product Detail Page | URL: `/produto/:slug` (ex: `/produto/club-de-nuit-iconic-armaf`)

**Objetivo:** Transformar a PDP em uma experiência completa, conversiva e alinhada ao design system Dark Liquid Glass.

---

## 1. Estado atual

### O que já existe

| Elemento | Status | Observação |
|----------|--------|------------|
| Layout 2 colunas (imagem + info) | ✅ | Desktop |
| Imagem com frame glass-gold | ✅ | Glow cinematográfico |
| Badges (Mais Vendido, Novo) | ✅ | |
| Rating + reviews | ⚠️ | Bug: usa `product.reviews` (não existe) → deveria ser `reviews_count` |
| Nome, marca, inspirado em | ✅ | |
| Tags (público, ml, tags) | ✅ | |
| Pirâmide olfativa | ✅ | **Mock** — mesmas notas para todos |
| Features (fixação, projeção) | ✅ | **Hardcoded** — iguais para todos |
| Preço + parcelamento | ✅ | |
| Seletor quantidade | ✅ | |
| Botão Adicionar ao Carrinho | ✅ | |
| Trust (Envio, Garantia) | ✅ | |
| TestimonialsSection | ✅ | Genérico, não do produto |
| Breadcrumb | ✅ | Voltar ao catálogo |

### Problemas críticos

1. **Rota não resolve slug:** A URL `/produto/club-de-nuit-iconic-armaf` usa o param `:id`, mas o valor é um slug. `getProductById("club-de-nuit-iconic-armaf")` retorna `undefined` → redirect para /catalogo.

2. **Bug `product.reviews`:** O tipo `Product` tem `reviews_count`, não `reviews`. Causa erro de render.

3. **Falta UpsellShelf:** Produtos relacionados / "Compre junto" não aparecem na PDP.

4. **Falta botão WhatsApp:** O catálogo tem "Comprar no WhatsApp" — a PDP não.

5. **Falta galeria de imagens:** Só 1 imagem; em Perfume-Arabe-fotos há `_01`, `_02`, `_03` por produto.

---

## 2. Escopo da PDP completa

### 2.1 Estrutura proposta (de cima para baixo)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Catálogo > [Marca] > [Produto]                              │
├─────────────────────────────────────────────────────────────────────────┤
│  [IMAGEM]                    │  [INFO]                                   │
│  · Galeria (múltiplas fotos) │  · Marca + Nome + Inspirado em            │
│  · Zoom / Fullscreen         │  · Rating + reviews (corrigido)           │
│  · Badge estoque             │  · Tags (público, ml, etc.)               │
│  · Mouse tilt 3D (desktop)   │  · Pirâmide olfativa (dados reais)        │
│                              │  · Descrição do produto                   │
│                              │  · Features (por produto ou genéricas)    │
│                              │  · Preço + parcelamento                   │
│                              │  · Quantidade + Adicionar + WhatsApp      │
│                              │  · Trust (Envio, Garantia)                │
├─────────────────────────────────────────────────────────────────────────┤
│  Seção: Descrição completa (expandível ou tabs)                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Seção: Avaliações (breakdown estrelas + cards de reviews)               │
├─────────────────────────────────────────────────────────────────────────┤
│  Seção: Compre junto / Produtos relacionados (UpsellShelf)               │
├─────────────────────────────────────────────────────────────────────────┤
│  Testimonials (opcional — ou remover da PDP)                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Fases de implementação

### Fase 1 — Correções críticas (urgente)

| # | Tarefa | Arquivo | Descrição |
|---|--------|---------|-----------|
| 1.1 | Resolver rota por slug | `App.tsx`, `ProductPage.tsx` | Unificar `/produto/:slug` e fazer `getProductBySlug(param)` quando param não for numérico |
| 1.2 | Corrigir `product.reviews` | `ProductPage.tsx` | Trocar por `product.reviews_count` |
| 1.3 | Adicionar botão WhatsApp | `ProductPage.tsx` | Mesmo handler do ProductCard/QuickViewModal |

### Fase 2 — Dados e conteúdo

| # | Tarefa | Descrição |
|---|--------|-----------|
| 2.1 | Notas olfativas reais | Expandir `Product` ou criar `productScentNotes` map; integrar com eco-back quando houver API |
| 2.2 | Descrição por produto | Campo `description` em Product; fallback genérico |
| 2.3 | Galeria de imagens | Usar `_01`, `_02`, `_03` de Perfume-Arabe-fotos quando existirem; helper em `productImages.ts` |
| 2.4 | Badge "Últimas unidades" | Quando `stock <= 5` e `stock > 0` |

### Fase 3 — UX e interações

| # | Tarefa | Descrição |
|---|--------|-----------|
| 3.1 | Galeria com thumbnails | Miniaturas clicáveis; troca da imagem principal |
| 3.2 | Fullscreen ao clicar | Dialog com imagem grande, navegação entre fotos |
| 3.3 | Mouse tilt 3D | Hook `useMouseTilt` no desktop; desativar em mobile |
| 3.4 | Seletor quantidade | Animação scale flash ao mudar; botões mais refinados |
| 3.5 | CTA Adicionar | Estados loading (spinner) e sucesso (checkmark + toast) |

### Fase 4 — Seções adicionais

| # | Tarefa | Descrição |
|---|--------|-----------|
| 4.1 | UpsellShelf na PDP | `<UpsellShelf context="PDP" currentProductId={product.id} />` |
| 4.2 | Seção de avaliações | Breakdown 5★ com barras de progresso; cards de reviews (mock ou API) |
| 4.3 | Descrição expandível | Accordion ou tabs: Descrição | Modo de uso | Ingredientes |
| 4.4 | SEO | `document.title`, meta description, Open Graph, JSON-LD Product |

### Fase 5 — Polish visual (fase-4 design)

| # | Tarefa | Referência |
|---|--------|------------|
| 5.1 | Glow maior na imagem | blur 100px, gold/15 |
| 5.2 | Badge estoque com pulse | Quando "Últimas unidades" |
| 5.3 | Light sweep no CTA | Efeito no hover do botão Adicionar |
| 5.4 | Avaliações em glass | Cards com avatar inicial gold |

---

## 4. Modelo de dados (expandir)

### Product atual + campos sugeridos

```typescript
// Já existe
interface Product {
  id, slug, name, brand, audience, size_ml, inspired_by, tags,
  price_brl, cost_usd, wholesale_usd, stock, availability,
  is_best_seller, is_new, rating, reviews_count, image
}

// Adicionar (ou em produto separado)
interface ProductDetail {
  description?: string;           // Texto longo
  scent_notes?: {                // Pirâmide olfativa
    top: string[];
    heart: string[];
    base: string[];
  };
  features?: string[];           // Lista customizada por produto
  images?: string[];              // Galeria (ou derivar de productImages)
  how_to_use?: string;           // Modo de uso
}
```

### Fonte das notas olfativas

- **Curto prazo:** Map estático em `productScentNotes.ts` por `productId` ou `slug`
- **Médio prazo:** eco-back API `GET /products/:id` com campo `scent_notes`
- **Referência:** `eco-back/docs/products.md` tem "Inspirado em" — notas podem vir de planilha/CRM

---

## 5. Rotas e URLs

### Situação atual

| Rota | Param | Uso |
|------|-------|-----|
| `/produto/:id` | id | Usado com slug (ex: club-de-nuit-iconic-armaf) |
| `/p/:slug` | slug | Alternativa, pouco usada |

### Proposta

- **Unificar:** Usar apenas `/produto/:slug`
- **Lógica:** `ProductPage` tenta `getProductBySlug(param)` primeiro; se falhar, tenta `getProductById(param)` (para links antigos com ID numérico)
- **Redirect 301:** Se alguém acessar `/p/:slug`, redirect para `/produto/:slug`

---

## 6. Galeria de imagens

### Lógica

- Em `productImages.ts`, criar `getProductImages(name, brand): string[]` que retorna array de URLs `_01`, `_02`, `_03` quando existirem
- Verificar no filesystem ou manter lista estática dos produtos com múltiplas fotos
- Fallback: `[product.image]` (só a principal)

### Componente

```tsx
<ProductGallery 
  images={productImages} 
  alt={product.name}
  onFullscreen={(index) => openDialog(index)}
/>
```

- Thumbnails em linha abaixo da principal
- Click na principal → fullscreen
- Swipe em mobile

---

## 7. SEO

| Elemento | Implementação |
|----------|---------------|
| Title | `{product.name} — {product.brand} \| ESSENCE Árabe` |
| Meta description | Descrição curta com nome, inspiração, preço |
| OG image | `product.image` |
| Canonical | `https://essencearabe.com.br/produto/${product.slug}` |
| JSON-LD | Schema.org Product com name, image, offers, aggregateRating |

---

## 8. Checklist de conclusão

### Fase 1 (crítico) ✅
- [x] Rota `/produto/:slug` resolve produto corretamente
- [x] `product.reviews_count` corrigido
- [x] Botão WhatsApp na PDP

### Fase 2 (dados) ✅
- [x] Notas olfativas por produto (productScentNotes.ts)
- [x] Descrição por produto (productDescriptions.ts)
- [x] Galeria múltiplas fotos (getProductImages + ProductGallery)
- [x] Badge "Últimas unidades"

### Fase 3 (UX) ✅
- [x] Fullscreen ao clicar na imagem (com navegação entre fotos)
- [x] Mouse tilt 3D (desktop) — useMouseTilt
- [x] Estados loading/sucesso no CTA — AddToCartButton

### Fase 4 (seções) ✅
- [x] UpsellShelf na PDP
- [x] Seção de avaliações (ProductReviews)
- [x] Descrição expandível (Collapsible)
- [x] SEO (document.title)

### Fase 5 (visual) ✅
- [x] Glow cinematográfico na imagem
- [x] shine-effect no CTA (já existia)
- [x] Cards avaliações em glass

---

## 9. Ordem sugerida

1. **Fase 1** — Corrigir rota + bug + WhatsApp (1 sessão)
2. **Fase 2** — Dados básicos (notas, descrição, galeria) (1–2 sessões)
3. **Fase 3** — Interações (galeria fullscreen, tilt, CTA states) (1 sessão)
4. **Fase 4** — UpsellShelf + Avaliações + SEO (1 sessão)
5. **Fase 5** — Polish visual (conforme tempo)

---

*Documento vivo — atualizar conforme implementação avança.*
*Criado: Março 2026*
