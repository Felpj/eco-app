# Fase 5 — Commerce Flow
> Carrinho, Checkout, Order Success

**Pré-requisito:** Fases 1 e 2 concluídas
**Arquivos:** `src/pages/Cart.tsx`, `src/pages/Checkout.tsx`, `src/pages/OrderSuccess.tsx`, `src/components/commerce/*`, `src/components/checkout/*`, `src/components/upsell/*`

---

## Objetivo

O fluxo de compra precisa ser confiável, claro e premium ao mesmo tempo. O usuário está prestes a pagar — cada elemento deve transmitir segurança e confirmação de uma boa escolha.

---

## 5.1 — Carrinho (Cart.tsx)

### Layout geral

```
Mobile: Stack vertical (items → upsell → summary)
Desktop: 2 colunas (items [2/3] | summary [1/3])
```

### CartItemRow (CartItemRow.tsx)

```
┌──────────────────────────────────────────────────────────────┐
│  [img 80x80]   Club de Nuit · ARMAF                          │
│  (rounded-xl)  Para Ele · 100ml                              │
│                ★★★★★                                         │
│                                                              │
│                [−] 2 [+]          R$ 378,00                  │
│                            [🗑 Remover]                       │
└──────────────────────────────────────────────────────────────┘
```

- Container: `glass rounded-xl` com separador gold/10 entre items
- Imagem: rounded-xl, sem borda
- Quantidade: controles em glass pill (−·número·+)
- Preço: gold, tamanho adequado
- Remover: ícone trash, cor muted, hover destructive
- Animação ao remover: slide para a direita + fade (AnimatePresence)
- Animação ao adicionar quantidade: scale flash no preço

### Free Shipping Progress (FreeShippingProgress.tsx)

```
┌─────────────────────────────────────────────────────┐
│  🚚  Faltam R$ 80 para frete grátis!               │
│  ████████████░░░░░░  R$ 219 / R$ 299                │
└─────────────────────────────────────────────────────┘
```

- Ícone: Lucide TruckIcon (não emoji)
- Barra: gradiente gold (anima ao mudar valor com `transition-all`)
- Texto: dinâmico (faltam X / você ganhou frete grátis!)
- Card: glass rounded-xl
- Quando atingido: animação celebratória (pulse-gold na barra, texto muda)

### Order Bumps (OrderBumpCard.tsx)

```
┌──────────────────────────────────────────────────────┐
│  ⚡ Oferta Especial — Adicione ao seu pedido          │
│                                                      │
│  [img 60x60]   Miniatura de Oud                      │
│  Desconto 40%  "Combina perfeitamente com sua        │
│                 escolha!"                            │
│                                                      │
│  De R$ 89  Por R$ 49   [+ Adicionar R$ 49]          │
└──────────────────────────────────────────────────────┘
```

- Card: `glass-gold` — mais chamativo que os itens normais
- Badge "Oferta Especial": gold gradient, pulsante
- Imagem: rounded-lg
- Preço: strike-through + gold
- CTA: botão compacto, gold outline
- Animação de entrada: slide-up com delay após os items do carrinho

### Cart Summary (CartSummary.tsx)

```
┌──────────────────────────────┐
│  Resumo do Pedido             │
│                              │
│  Subtotal           R$ 378   │
│  Cupom -10%         -R$ 37   │
│  Frete              Grátis   │
│  ────────────────────────    │
│  Total              R$ 341   │
│                              │
│  [Campo de cupom]            │
│                              │
│  [→ Finalizar Compra]        │
│                              │
│  🔒 Compra 100% segura        │
│  [Visa] [Master] [Pix]       │
└──────────────────────────────┘
```

- Container: `glass rounded-2xl` sticky no desktop
- Separador: linha gold/10
- Total: destaque em gold, tamanho maior
- Campo de cupom: input glass, botão "Aplicar" gold
- CTA Finalizar: botão gold grande (56px height), light sweep no hover
- Selos de segurança: ícones SVG + texto pequeno

---

## 5.2 — Checkout (Checkout.tsx)

### Steps Indicator

```
Contato  ──●──  Entrega  ──○──  Pagamento  ──○──  Revisão
```

- Step ativo: círculo gold sólido com número
- Steps futuros: círculo vazio, border muted
- Steps completos: ícone check dentro do círculo gold
- Linha de conexão: gradiente da esquerda (completo gold) para direita (muted)
- Animação: ao avançar, animação de preenchimento da linha

### Step Forms

**Estilo geral de todos os inputs:**
```tsx
// Input refinado para o tema dark premium
<input className="w-full bg-[#111] border border-[var(--glass-border)]
  rounded-xl px-4 py-3 text-foreground
  placeholder:text-muted/50
  focus:border-gold/50 focus:ring-2 focus:ring-gold/20
  focus:outline-none
  transition-all duration-200" />

// Label acima (sempre visível, nunca placeholder-only)
<label className="text-xs text-muted uppercase tracking-wider mb-1.5 block">
  Nome completo
</label>
```

**Step de Endereço:**
- CEP com auto-fill: loading indicator no input enquanto busca
- Campos aparecem progressivamente após CEP ser preenchido

**Step de Pagamento:**
- Cards de opção (PIX / Cartão) em glass com radio estilizado
- PIX selecionado: card borda gold, QR code placeholder, cópia de chave
- Cartão: campos de número com format mask (#### #### #### ####)

**Order Bump no Checkout:**
- Aparece discretamente entre step de pagamento e revisão
- Menor que no carrinho, mas com mesma classe visual

### Order Summary Sticky

```
- Desktop: fixed no lado direito, acompanha scroll
- Mobile: collapsible no topo da página
- Conteúdo: mini resumo (items, total, código de cupom)
- Glass com border gold/10
```

---

## 5.3 — Order Success (OrderSuccess.tsx)

### Visão da tela

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│               ✅ (ícone grande, animado)                     │
│                                                              │
│           Pedido Confirmado!                                  │
│      Seu pedido #EA-20260314-1234 foi recebido.              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  O que acontece agora?                                │   │
│  │  ① Confirmação por WhatsApp  ← timeline animada      │   │
│  │  ② Separação em 24h                                  │   │
│  │  ③ Envio com rastreamento                            │   │
│  │  ④ Entrega em 3-7 dias úteis                         │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  [📱 Acompanhar no WhatsApp]   [→ Ver meu Pedido]           │
│                                                              │
│  [Oferta pós-compra — aparece após 2s]                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Animações de celebração:**
- Ícone de check: scale de 0 para 1 com spring physics
- Partículas: pequenos pontos dourados que explodem e caem
  (usar CSS keyframes simples, 20-30 partículas, sem biblioteca extra)
- Timeline: items aparecem em stagger (200ms cada)

**Timeline de entrega:**
```tsx
// Componente de steps vertical
// Cada step: círculo numerado gold + texto
// Animação: cada step aparece após o anterior (stagger)
// Linha vertical conectando os steps (progresso animado de cima para baixo)
```

**Post-Purchase Modal:**
- Aparece após 2.5s (não imediatamente)
- Glass-gold container
- "Aproveite antes de finalizar:" + produto com desconto especial
- Timer countdown (ex: "Esta oferta expira em 10:00")
- CTA: adicionar ao pedido atual

---

## 5.4 — Checklist da Fase 5

**Carrinho:**
- [ ] CartItemRow: glass, controles refinados, animação de remoção
- [ ] Free Shipping Progress: barra gold animada, celebração ao atingir meta
- [ ] Order Bumps: glass-gold, badge pulsante, animação de entrada
- [ ] Cart Summary: sticky desktop, campo de cupom refinado
- [ ] CTA com light sweep effect

**Checkout:**
- [ ] Steps indicator com animação de progresso
- [ ] Inputs com estilo dark premium (focus ring gold)
- [ ] CEP auto-fill com loading indicator
- [ ] Opções de pagamento em glass cards com radio estilizado
- [ ] Order Summary sticky (desktop)

**Order Success:**
- [ ] Check icon com spring animation
- [ ] Partículas de celebração em CSS
- [ ] Timeline com stagger animation
- [ ] Post-purchase modal após delay
- [ ] WhatsApp CTA destacado

---

*Próxima fase: [fase-6-conta.md](./fase-6-conta.md)*
