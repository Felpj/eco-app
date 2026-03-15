# Fase 6 — Área da Conta
> AccountHome, OrdersList, OrderDetails, Addresses, Preferences

**Pré-requisito:** Fases 1 e 2 concluídas
**Arquivos:** `src/pages/account/*`

---

## Objetivo

A área da conta é o ambiente mais íntimo do usuário — onde ele gerencia sua relação com a marca. Deve ser funcional, clara e coerente com a estética premium, sem exageros visuais que atrapalhem a usabilidade.

---

## 6.1 — Layout Base da Área Logada

### Estrutura

```
Desktop:
┌─────────────────┬──────────────────────────────────────────┐
│   SIDEBAR       │   CONTEÚDO PRINCIPAL                     │
│  (240px fixed)  │                                          │
│                 │                                          │
│  ○ Minha Conta  │   [Header da seção]                      │
│  ○ Pedidos      │   [Conteúdo]                             │
│  ○ Endereços    │                                          │
│  ○ Cupons       │                                          │
│  ○ Indicações   │                                          │
│  ○ Preferências │                                          │
│  ───────────    │                                          │
│  ○ Sair         │                                          │
└─────────────────┴──────────────────────────────────────────┘

Mobile: sem sidebar — usar tabs no topo ou menu com ícones
```

**Sidebar:**
- Background: `bg-[#0d0d0d]` levemente elevado do fundo
- Border direita: `border-[var(--glass-border)]`
- Nav items: ícone + texto, hover gold, active com gold background/10 e border-left gold
- Usuário: avatar inicial + nome + email no topo
- Separador antes de "Sair": linha gold/10

---

## 6.2 — Account Home (AccountHome.tsx)

### Dashboard

```
┌─────────────────────────────────────────────────────┐
│  Olá, [Nome]! 👋                                     │  ← sem emoji, usar saudação textual
│  Membro desde Janeiro 2026                           │
│                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 3 Pedidos│ │ 2 Cupons │ │ R$ 580   │            │ ← glass cards de métricas
│  │          │ │  Ativos  │ │ em compras│            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│  Últimos Pedidos                                    │
│  [lista dos 3 mais recentes]                        │
│                                                     │
│  [→ Ver todos os pedidos]                           │
└─────────────────────────────────────────────────────┘
```

- Saudação: Playfair Display, tamanho generoso
- Métricas: 3 glass cards com número em gold e label em muted
- Recent orders: lista compacta com status badge

---

## 6.3 — Orders List (OrdersList.tsx)

### Card de pedido

```
┌──────────────────────────────────────────────────────────┐
│  #EA-20260314-1234          [● Em separação]             │
│  14 de março de 2026        badge colorido               │
│                                                          │
│  [img] [img] [img] +2       R$ 378,00                    │
│  Club de Nuit, Oud Noir...                               │
│                                                          │
│                    [→ Ver detalhes]                      │
└──────────────────────────────────────────────────────────┘
```

- Container: `glass rounded-xl`
- Status badge: cores semânticas (amarelo=separação, azul=enviado, verde=entregue)
- Thumbnails dos produtos: pequenos, sobrepostos (stack visual)
- CTA: link simples com seta

---

## 6.4 — Order Details (OrderDetails.tsx)

### Layout

```
- Timeline de status (vertical, igual ao OrderSuccess mas com histórico real)
- Informações de rastreamento
- Lista de items do pedido
- Resumo de valores
- Endereço de entrega
- Método de pagamento
```

**Timeline de status:**
```tsx
// Estados: Confirmado → Em Separação → Enviado → Entregue
// Cada estado: círculo (check se completo, empty se futuro)
// Estado atual: pulsante (animate-pulse-gold)
// Linha conectora: preenchida até o estado atual
```

---

## 6.5 — Addresses (Addresses.tsx)

### Card de endereço

```
┌──────────────────────────────────────┐
│  [📍] Casa                   [Padrão] │
│                                      │
│  Rua das Flores, 123                 │
│  Apto 45 — Bela Vista                │
│  São Paulo, SP · 01310-000           │
│                                      │
│  [✏ Editar]    [🗑 Excluir]          │
└──────────────────────────────────────┘
```

- Cards em glass
- Badge "Padrão": gold pill
- ícones: Lucide (MapPin, Edit, Trash)
- Botão "Adicionar endereço": botão outline gold, abre modal
- Modal de novo endereço: glass, mesma estética do checkout

---

## 6.6 — Preferências (Preferences.tsx)

### Layout

```
Seções com toggle switches:

Notificações
  ○ Email sobre pedidos        [toggle]
  ○ WhatsApp sobre promoções   [toggle]
  ○ Lançamentos por email      [toggle]

Preferências de Perfume
  [chips de categoria: Oud / Floral / Cítrico / Oriental / Amadeirado]
  Selecionados ficam ativos (glass-gold)
```

- Toggles: custom com thumb gold, track gold/30 quando ativo
- Category chips: igual ao CollectionChips do catálogo
- Salvar: botão gold ao final, com feedback de sucesso

---

## 6.7 — Auth Pages (Login, Signup, RecoverPassword)

### Redesign

```
Layout: 2 colunas em desktop
- Esquerda: imagem/visual da marca (produto + aurora)
- Direita: formulário centralizado

Mobile: só o formulário

Formulário:
┌──────────────────────────────┐
│  ESSENCE ÁRABE (logo)        │
│  [título da página]          │
│                              │
│  [inputs com estilo premium] │
│                              │
│  [CTA principal]             │
│  [link secundário]           │
└──────────────────────────────┘
```

- Formulário: glass card centralizado
- Inputs: mesmo estilo definido na Fase 5 (checkout)
- Lado esquerdo (desktop): imagem do produto com aurora, citação editorial

---

## 6.8 — Checklist da Fase 6

**Layout base:**
- [ ] Sidebar da área logada (desktop) implementada
- [ ] Mobile: navegação alternativa (tabs ou menu)
- [ ] Nav items: hover/active gold

**Pages:**
- [ ] AccountHome: métricas em glass cards, recent orders
- [ ] OrdersList: cards de pedido refinados com status badge
- [ ] OrderDetails: timeline de status com animate-pulse no estado atual
- [ ] Addresses: cards glass, modal de adicionar
- [ ] Preferences: toggles e chips estilizados
- [ ] Auth pages: layout 2 colunas desktop

---

*Fase final do roadmap de redesign visual.*
*Consultar: [VISUAL_REDESIGN_ROADMAP.md](./VISUAL_REDESIGN_ROADMAP.md)*
