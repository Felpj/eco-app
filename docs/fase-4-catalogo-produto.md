# Fase 4 — Catálogo & Página de Produto
> CatalogoPage.tsx, ProductCard.tsx, ProductPage.tsx, componentes de catalog/

**Pré-requisito:** Fases 1 e 2 concluídas (Fase 3 independente desta)
**Arquivos:** `src/pages/CatalogoPage.tsx`, `src/pages/ProductPage.tsx`, `src/components/catalog/*`

---

## Objetivo

O catálogo e a página de produto são onde a conversão acontece. Precisam equilibrar elegância visual com funcionalidade clara: o usuário precisa encontrar, se apaixonar e comprar.

---

## 4.1 — PromoBar (componente de entrada)

### Redesign

```tsx
// PromoBar.tsx — topo do catálogo

// Atual: barra simples com texto
// Novo: glass com animação de texto alternado

- Background: glass com border gold muito sutil
- Texto: carousel automático de 3 mensagens (3s cada, crossfade)
  Mensagem 1: "🚚 Frete grátis acima de R$ 299"  [transformar ícone em SVG]
  Mensagem 2: "✨ +500 clientes satisfeitos em todo o Brasil"
  Mensagem 3: "💳 Pague em até 12x no cartão"
- Ícones: SVG Lucide (não emoji)
- Altura: compacta (36px)
- Animação: opacity crossfade entre mensagens
```

---

## 4.2 — Collection Chips (CollectionChips.tsx)

### Redesign

```
Atual: botões simples de filtro por coleção

NOVO:
- Pills com glass effect
- Active state: preenchido com gold gradient, texto escuro, glow-sm
- Hover: border gold sutil, texto gold
- Transição: spring animation (scale + background)
- Scroll horizontal em mobile com snap

Visual de cada chip:
┌──────────────────────┐
│  Oud Premium         │  ← ativo: background gold gradient
│  Club de Nuit        │  ← hover: border gold
│  Para Ela            │  ← inativo: glass sutil
└──────────────────────┘
```

---

## 4.3 — Product Card (ProductCard.tsx) — FOCO PRINCIPAL

### Estado atual
- Card simples com imagem, nome, preço, botão
- Hover básico

### Redesign completo do card

```
┌─────────────────────────────┐
│  [badge: "Mais Vendido"]    │
│                             │
│  [IMAGEM DO PRODUTO]        │  ← zoom scale 1.05 no hover
│  (fundo com glow sutil)     │     + aparece overlay com quick add
│                             │
│  ─────────────────────────  │
│  [brand em uppercase muted] │
│  Nome do Perfume            │
│  Para Ele · 100ml           │
│  ★★★★★ (4.9) · 128 avaliações│
│                             │
│  De R$ 299  Por R$ 189      │
│  ou 12x R$ 15,75            │
│                             │
│  [+ Adicionar ao Carrinho]  │
└─────────────────────────────┘
```

**Hover state (desktop):**
```
- Card sobe 6px (translateY)
- Sombra aumenta (shadow-card-hover)
- Border fica levemente mais visível
- Na imagem: aparece overlay glass escuro com 70% opacity
  contendo: [Ver Produto →] centralizado
- Imagem faz zoom sutil (scale 1.05)
- Badge "Adicionar" pode aparecer no rodapé do overlay
```

**Especificações do card:**
```tsx
// Estrutura de classes sugerida
<article className="glass rounded-2xl overflow-hidden cursor-pointer
  group transition-all duration-300
  hover:-translate-y-1.5 hover:shadow-card-hover
  hover:border-[var(--glass-border-top)]">

  {/* Image wrapper */}
  <div className="relative overflow-hidden aspect-square bg-[#111]">
    <img className="w-full h-full object-cover
      transition-transform duration-500 ease-expo-out
      group-hover:scale-105" />

    {/* Quick view overlay */}
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm
      opacity-0 group-hover:opacity-100
      transition-opacity duration-300
      flex items-center justify-center">
      <span className="text-white font-medium">Ver Produto →</span>
    </div>

    {/* Badges (top corners) */}
    <span className="absolute top-3 left-3 glass-gold px-2 py-1
      text-gold text-xs uppercase tracking-wider rounded-full">
      Mais Vendido
    </span>
  </div>

  {/* Info */}
  <div className="p-4 space-y-2">
    <p className="text-xs text-muted uppercase tracking-widest">ARMAF</p>
    <h3 className="font-display text-base font-semibold">Club de Nuit</h3>
    <div className="flex items-center gap-1 text-xs text-muted">
      <Stars /> 4.9 · 128 avaliações
    </div>
    <div className="pt-2">
      <p className="text-xs text-muted line-through">R$ 299</p>
      <p className="text-xl font-bold text-gold">R$ 189</p>
      <p className="text-xs text-muted">12x R$ 15,75</p>
    </div>
    <button className="w-full mt-3 btn-primary">
      Adicionar ao Carrinho
    </button>
  </div>
</article>
```

**Grid reveal animation (stagger):**
```tsx
// Quando os cards entram na tela (scroll trigger):
// Cada card tem um delay baseado no seu índice
// Framer Motion staggerChildren: 0.06s
// Cada card: fade + translateY(20px) → translateY(0)
```

---

## 4.4 — Filter Sidebar (FilterSidebar.tsx)

### Redesign

```
- Fundo: bg-elevated com border glass à direita
- Título "Filtros" com ornamento árabe antes
- Seções de filtro: accordion com animação suave
- Checkbox: substituir por checkbox custom com gold accent
- Range slider: custom slider com trilha gold
- Botão "Aplicar": gold gradient
- Botão "Limpar": texto muted, hover gold
- Active filters: chips removíveis no topo do grid
```

---

## 4.5 — Product Skeleton (ProductSkeleton.tsx)

### Redesign

```tsx
// Usar shimmer mais refinado com cores coerentes com o tema

// Gradiente do shimmer:
background: linear-gradient(
  90deg,
  #111 25%,
  #1a1a1a 50%,
  #111 75%
);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;

// Forma do skeleton igual ao card final
// (mesmas dimensões e bordas)
```

---

## 4.6 — Quick View Modal (QuickViewModal.tsx)

### Redesign

```
Modal central com:
- Background: glass escuro, backdrop-blur forte no conteúdo de fundo
- Sombra: grande, escura
- Animação de entrada: scale 0.95 + fade → scale 1 + opaque
- Conteúdo: mini versão da PDP (imagem + info + CTA)
- Fechar: X button no canto, ou click fora
- Aurora sutil atrás
```

---

## 4.7 — Página de Produto (ProductPage.tsx) — FOCO ALTO

### Layout geral (manter 2 colunas desktop, manter estrutura)

### Melhorias na imagem do produto

```
- Frame: border gold/20, rounded-3xl
- Glow atrás: maior, mais cinematográfico (blur 100px, gold/15)
- Badge de estoque: pill com pulse animation se "Últimas unidades"
- Mouse tilt 3D (igual ao hero, suave) no desktop
- Fullscreen preview ao clicar (Dialog com a imagem grande)
```

### Seção de informações

**Notas olfativas (elemento novo):**
```tsx
// Adicionar abaixo da descrição do produto
// Três colunas: Topo / Coração / Fundo

<section className="border-t border-glass-border pt-6">
  <h3 className="text-xs uppercase tracking-widest text-muted mb-4">
    Pirâmide Olfativa
  </h3>
  <div className="grid grid-cols-3 gap-4">
    {['Topo', 'Coração', 'Fundo'].map((layer, i) => (
      <div key={layer} className="glass rounded-xl p-3 text-center">
        <p className="text-xs text-muted">{layer}</p>
        <p className="text-sm text-gold mt-1">Bergamota</p>
      </div>
    ))}
  </div>
</section>
```

**Seletor de quantidade:**
- Botões `-` e `+` mais refinados (glass, rounded)
- Número centralizado com tipografia maior
- Animação sutil ao mudar (scale flash)

**Botão Adicionar ao Carrinho:**
- Tamanho maior (height 56px)
- Efeito light sweep no hover (brilho que varre da esquerda)
- Estado loading: spinner gold
- Estado sucesso: checkmark + mensagem momentânea

**Seção de avaliações (melhorar):**
- Breakdown de estrelas com barras de progresso animadas
- Cards de reviews em glass
- Avatar com inicial colorida (gold background)

**Produtos relacionados (UpsellShelf):**
- Carousel horizontal com scroll snap
- Cards iguais ao ProductCard redesenhado

---

## 4.8 — Checklist da Fase 4

**Catálogo:**
- [ ] PromoBar com carousel de mensagens e crossfade
- [ ] Collection chips com glass + active gold gradient
- [ ] ProductCard: glass, hover lift, overlay quick view
- [ ] ProductCard: stagger animation no grid
- [ ] Filter sidebar: accordion, checkbox gold, slider custom
- [ ] ProductSkeleton: shimmer no tema correto
- [ ] Quick View Modal: glass + spring animation

**Produto:**
- [ ] Imagem: frame gold, glow cinematográfico, mouse tilt
- [ ] Pirâmide olfativa adicionada (notas de topo/coração/fundo)
- [ ] Seletor de quantidade refinado
- [ ] CTA com light sweep + estados loading/sucesso
- [ ] Avaliações: barras de progresso animadas
- [ ] UpsellShelf como carousel com snap

---

*Próxima fase: [fase-5-commerce.md](./fase-5-commerce.md)*
