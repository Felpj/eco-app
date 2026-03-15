# Fase 3 — Homepage / Landing Page
> Index.tsx, HeroSection, todas as seções da landing

**Pré-requisito:** Fases 1 e 2 concluídas
**Arquivos:** `src/pages/Index.tsx`, `src/components/HeroSection.tsx`, `src/components/FeaturedProduct.tsx`, `src/components/BenefitsSection.tsx`, `src/components/TestimonialsSection.tsx`, `src/components/CTASection.tsx`

---

## Objetivo

A homepage é a vitrine da marca. Precisa impressionar em 3 segundos, comunicar luxo e confiança, e converter visitante em comprador. Cada seção deve ser uma cena cinematográfica.

---

## 3.1 — Hero Section (maior impacto)

### Estado atual
- Blobs de glow estáticos (opacity baixa)
- Fade-in simples com Framer Motion
- Floating elements com `animate={{ y: [-10, 10, -10] }}`
- Pattern de pontos no fundo

### Visão da nova Hero

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   [ornamento árabe sutil no topo]                             ║
║                                                               ║
║   Pequena label: "· Perfumaria Árabe Autêntica ·"            ║
║                                                               ║
║   TÍTULO PRINCIPAL                     [Imagem do frasco]     ║
║   em Playfair Display                  flutuando com         ║
║   bold, 72px+                          perspectiva 3D sutil   ║
║                                                               ║
║   [citação editorial em Cormorant]     [aurora atrás]        ║
║   "O perfume certo não se usa.                               ║
║    Ele fala por você."                                       ║
║                                                               ║
║   [CTA] Ver Catálogo  [CTA secondary] Nossa História          ║
║                                                               ║
║   ─────────────────────────────────────────                  ║
║   [indicadores de confiança em glass cards]                  ║
║   500+ clientes · Envio rápido · Fórmula autêntica           ║
╚═══════════════════════════════════════════════════════════════╝
```

### Implementação detalhada

**Sequência de reveal (timing coreografado):**
```
t=0ms    Background e blobs aurora (já visíveis)
t=200ms  Label badge (scale + fade)
t=400ms  Título linha 1 (slide de baixo, blur → nítido)
t=600ms  Título linha 2
t=800ms  Citação editorial (fade + slide sutil)
t=900ms  CTAs (stagger de 100ms cada)
t=1100ms Trust badges (stagger de 80ms cada)
t=800ms  Imagem do produto (slide da direita + float animation)
```

**Aurora Hero (específico):**
```tsx
// Blobs maiores e mais expressivos que os globais
// Hero tem o seu próprio sistema de aurora:

{/* Blob dourado principal — atrás do título */}
<div className="absolute top-[-10%] left-[-5%] w-[800px] h-[700px]
  rounded-full bg-[var(--aurora-gold)] blur-[120px]
  animate-aurora opacity-60 pointer-events-none" />

{/* Blob âmbar — atrás da imagem do produto */}
<div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px]
  rounded-full bg-[var(--aurora-amber)] blur-[100px]
  animate-aurora animation-delay-[3000ms] opacity-50
  pointer-events-none" />
```

**Produto flutuante com perspectiva 3D:**
```tsx
// Hook: useMousePosition — captura posição do mouse
// Aplica tilt 3D sutil na imagem do produto
// Max: 8 graus em X e Y
// Responsivo: desativado em mobile (performance + UX)

const { x, y } = useMousePosition()
const rotateX = useTransform(y, [0, windowHeight], [8, -8])
const rotateY = useTransform(x, [0, windowWidth], [-8, 8])

<motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
  <img src={heroProduct} className="animate-float-gentle" />
</motion.div>
```

**Citação editorial:**
```tsx
// Elemento novo — não existe atualmente
// Fonte: Cormorant Garamond italic
// Texto de exemplo: "Perfumes que contam histórias do Oriente."
// Cor: gold-light com opacity 0.7
// Animação: fade-in muito suave, delay longo para não competir com título

<motion.p className="text-editorial text-scent max-w-[380px]"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.8, duration: 1.2 }}>
  "O perfume certo não se usa. Ele fala por você."
</motion.p>
```

**Trust badges (glass cards):**
```tsx
// Substituir os indicadores atuais por cards glass pequenos
// Disposição horizontal: scroll em mobile, flex em desktop

const badges = [
  { icon: UsersIcon,    value: '500+',    label: 'Clientes' },
  { icon: TruckIcon,    value: '24h',     label: 'Envio Rápido' },
  { icon: ShieldIcon,   value: '100%',    label: 'Autêntico' },
  { icon: HeartIcon,    value: '4.9★',    label: 'Avaliação' },
]

// Cada badge: glass card 80px wide, ícone gold, stagger animation
```

---

## 3.2 — Featured Product Section

### Estado atual
- Grid 2 colunas: imagem esquerda + info direita
- Glow blur atrás da imagem
- Slide in da esquerda/direita

### Melhorias

**Imagem:**
- Adicionar `glass-gold` frame ao redor da imagem (border gold sutil)
- Glow atrás maior e mais cinematográfico
- Badge "Mais Vendido" com pulse-gold animation
- Hover na imagem: scale 1.02, sombra maior

**Info side:**
- Adicionar uma linha de "notas olfativas" com ícones e texto editorial
  ```
  Notas de Topo    Coração    Fundo
  [Bergamota]    [Oud]    [Âmbar]
  ```
- Preço com melhor hierarquia tipográfica
- "De R$ X por R$ Y" — "De" em muted, preço novo em grande gold
- CTA: botão com efeito de luz que varre da esquerda para direita no hover
- Linha editorial: citação em Cormorant sobre o perfume

**Seção geral:**
- Background: leve diferenciação (`bg-[#0d0d0d]`) para criar ritmo visual entre seções

---

## 3.3 — Benefits Section

### Estado atual
- Grid de ícones com texto (não visto o arquivo, assumindo padrão)

### Redesign

```
Layout: 4 cards horizontais em desktop, 2x2 em tablet, 1 coluna mobile

Cada card:
┌──────────────────────────┐
│  [ícone gold 32px]       │
│                          │
│  Título                  │
│  Descrição curta         │
│                          │
│  [linha ornamento]       │
└──────────────────────────┘

- Cards com glass effect
- Ícone com fundo circular `bg-gold/10` e border `border-gold/20`
- Hover: card sobe 4px, glow sutil, border mais visível
- Reveal: stagger 100ms por card, fade + translateY
- Background da seção: sutilmente mais escuro para respirar
```

---

## 3.4 — Testimonials Section

### Estado atual
- Carousel ou grid de depoimentos (assumir)

### Redesign

**Cada card de depoimento:**
```
┌──────────────────────────────────┐
│  ★★★★★                          │
│                                  │
│  "Este oud é incrível, nunca     │
│   encontrei algo igual..."        │ ← Cormorant Garamond italic
│                                  │
│  [avatar]  Nome do Cliente       │
│            São Paulo · SP        │
└──────────────────────────────────┘
```

- Cards: `glass` com border sutil
- Stars: animação sequencial de preenchimento (aparecem uma a uma)
- Texto: Cormorant Garamond italic para a citação, Inter para o nome
- Estrutura: carousel com auto-play lento (5s), pause no hover
- Indicadores: dots gold, animados
- Em mobile: swipe natural

---

## 3.5 — CTA Section

### Redesign

```
Layout: Full-width, centralizadoe com aurora forte atrás

┌────────────────────────────────────────────────────────────┐
│                                                            │
│              [ornamento árabe no centro]                   │
│                                                            │
│         Pronto para descobrir seu perfume?                 │
│     Perfumaria árabe autêntica para o Brasil.              │
│                                                            │
│         [CTA Principal: Explorar Catálogo]                 │
│         [Link: Falar no WhatsApp →]                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

- Background: gradient de `#080808` para `#111111` e de volta
- Aurora intensa atrás do texto (gold)
- CTA button: maior, com efeito de luz varrendo no hover
- Texto: Playfair Display em tamanho grande

---

## 3.6 — Nova Seção: "Nossa Filosofia" (ADICIONAR)

Seção nova entre Featured Product e Testimonials:

```
Proposta: comunicar a essência da marca através de texto + visual

┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  [Background com padrão geométrico árabe muito sutil]        │
│                                                              │
│  ·  O Que Nos Move  ·                                        │
│                                                              │
│  "Cada frasco que chega até você                             │
│   carrega a história de uma cultura                           │
│   milenar. Fragrâncias que não se                            │
│   compram em qualquer lugar."                                │
│                                      ← Cormorant, centralized│
│                                                              │
│  [3 pilares em linha com ícones SVG árabes]                  │
│  Autenticidade · Raridade · Acessibilidade                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3.7 — Padrão Geométrico Árabe (decorativo)

Criar SVG de padrão islâmico/árabe (estrela octogonal, arabescos geométricos) para usar como:
- Ornamentos de seção (50% opacity, tamanho pequeno)
- Background de seções específicas (2-3% opacity)
- Separadores entre seções

```svg
<!-- Exemplo de estrela de 8 pontas simples como separador -->
<svg width="40" height="40" viewBox="0 0 40 40">
  <!-- Estrela geométrica árabe estilizada -->
</svg>
```

---

## 3.8 — Checklist da Fase 3

**Hero:**
- [ ] Sequência de reveal coreografada (timing definido)
- [ ] Aurora hero (blobs maiores, mais expressivos)
- [ ] Citação editorial em Cormorant Garamond
- [ ] Mouse tilt 3D no produto (desktop only)
- [ ] Trust badges em glass cards com stagger
- [ ] Produto com `animate-float-gentle`

**Featured Product:**
- [ ] Frame glass-gold na imagem
- [ ] Notas olfativas section adicionada
- [ ] Hierarquia de preço refinada
- [ ] CTA com efeito light sweep no hover

**Benefits:**
- [ ] Cards glass com hover lift
- [ ] Stagger animation no reveal
- [ ] Ícone com fundo gold/10

**Testimonials:**
- [ ] Cards glass
- [ ] Stars com animação sequencial
- [ ] Texto em Cormorant Garamond
- [ ] Carousel com auto-play + swipe

**Nova seção "Nossa Filosofia":**
- [ ] Implementada entre Featured e Testimonials
- [ ] Padrão geométrico árabe no background

**Geral:**
- [ ] Ornamentos SVG árabes como separadores de seção
- [ ] Ritmo visual entre seções (alternância de backgrounds)
- [ ] prefers-reduced-motion respeitado em todas as animações

---

*Próxima fase: [fase-4-catalogo-produto.md](./fase-4-catalogo-produto.md)*
