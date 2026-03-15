# ESSENCE Árabe — Roadmap de Redesign Visual
> Planejamento estratégico para elevação do nível visual do front-end

---

## Visão

Transformar o site da ESSENCE Árabe em uma **experiência sensorial digital** — capaz de comunicar o que a perfumaria faz em essência: despertar emoções invisíveis através do que é visível.

O visitante deve sentir, ao navegar, que está entrando em um *ateliê de alta perfumaria árabe*: atmosfera envolvente, escuridão elegante, luz dourada suave, texturas translúcidas, e movimentos fluidos que hipnotizam sem distrair.

---

## Princípios de Design

| # | Princípio | Descrição |
|---|-----------|-----------|
| 1 | **Arquitetura Sensorial** | Cada elemento visual deve evocar uma sensação — calor, riqueza, mistério |
| 2 | **Dark Cinema** | O escuro não é ausência de luz — é onde a luz ganha significado |
| 3 | **Ouro como Linguagem** | O gold não é cor de decoração, é a voz da marca |
| 4 | **Movimento com Propósito** | Cada animação existe por uma razão semântica, não estética |
| 5 | **Glass & Depth** | Camadas de profundidade criam sensação de espaço e preciosidade |
| 6 | **Mobile-First Luxury** | Experiência premium que começa em 375px e escala para 1440px+ |

---

## Direção Visual (Style Direction)

### Estilo Principal: **Dark Liquid Glass + Cinematic Motion**

Combinação das referências:
- **Liquid Glass**: efeitos de vidro translúcido, blur cinematográfico, bordas finas luminosas
- **Modern Dark Cinema**: fundos em gradiente profundo, blobs de luz ambiente animados, tipografia hierárquica bold
- **E-commerce Luxury**: paleta dark gold, espaço em branco generoso, foco no produto

### Paleta de Cores (refinada)

```
Background system:
  --bg-void:        #080808     /* preto mais profundo */
  --bg-base:        #0a0a0a     /* fundo atual (manter) */
  --bg-elevated:    #111111     /* cards elevados */
  --bg-surface:     #181818     /* superfícies interativas */

Gold system:
  --gold-warm:      #C9A84C     /* gold principal — mais quente */
  --gold-light:     #E8C76A     /* highlights, texto em destaque */
  --gold-muted:     #8B6E2E     /* estados secundários */
  --gold-glow:      rgba(201, 168, 76, 0.15)  /* aura em hover */

Glass system:
  --glass-surface:  rgba(255, 255, 255, 0.04)
  --glass-border:   rgba(255, 255, 255, 0.08)
  --glass-highlight: rgba(255, 255, 255, 0.12) /* topo da borda */
  --glass-blur:     backdrop-filter: blur(20px)

Accent / Ambient:
  --aurora-1:       rgba(201, 168, 76, 0.12)  /* blob gold */
  --aurora-2:       rgba(120, 80, 30, 0.08)   /* blob âmbar */
  --aurora-3:       rgba(255, 240, 180, 0.04) /* halo suave */
```

### Tipografia (refinada)

```
Display:   Playfair Display — manter, aumentar uso em hero/títulos de seção
Body:      Inter — manter
New:       Cormorant Garamond — para citações, descrições de fragrância, poetry text
           (elegância editorial, caráter árabe-francês)
```

---

## Stack Visual Utilizada

| Ferramenta | Uso |
|-----------|-----|
| Framer Motion | Todas as animações (já instalado) |
| Tailwind CSS | Utility classes e tokens custom |
| CSS Custom Properties | Design tokens globais |
| shadcn/ui | Componentes base (manter, estilizar) |
| SVG inline | Ornamentos, padrões geométricos árabes |
| CSS `backdrop-filter` | Efeito glass |
| CSS `@keyframes` | Aurora, float, shimmer, particles |
| `prefers-reduced-motion` | Acessibilidade em todas as animações |

---

## Fases de Implementação

| Fase | Nome | Escopo | Impacto | Complexidade |
|------|------|--------|---------|--------------|
| **1** | Design System | Tokens, CSS, Tailwind | 🔴 Crítico | Baixa | ✅ Concluída |
| **2** | Global Shell | Header, Footer, Background | 🔴 Alto | Média | ✅ Concluída |
| **3** | Homepage | Hero, Seções, Landing | 🔴 Alto | Alta | ✅ Concluída |
| **4** | Catálogo & Produto | Cards, Filtros, PDP | 🟡 Alto | Alta | ✅ Concluída |
| **5** | Commerce Flow | Carrinho, Checkout, Sucesso | 🟡 Médio | Média | ✅ Concluída |
| **6** | Área da Conta | Dashboard, Pedidos, Perfil | 🟢 Médio | Baixa | ✅ Concluída |

> **Recomendação de ordem:** Fases 1 → 2 → 3 → 4 → 5 → 6
> Fases 1 e 2 desbloqueiam todo o resto. Nunca pular para fase 3 sem ter a 1 finalizada.

---

## Documentos por Fase

| Arquivo | Conteúdo |
|---------|----------|
| [`fase-1-design-system.md`](./fase-1-design-system.md) | Tokens, CSS, Tailwind config, efeitos base |
| [`fase-2-global-shell.md`](./fase-2-global-shell.md) | Header, Footer, Background, Page transitions |
| [`fase-3-homepage.md`](./fase-3-homepage.md) | Index, Hero, todas as seções da landing |
| [`fase-4-catalogo-produto.md`](./fase-4-catalogo-produto.md) | Catálogo, cards, filtros, página de produto |
| [`fase-5-commerce.md`](./fase-5-commerce.md) | Carrinho, checkout, order success |
| [`fase-6-conta.md`](./fase-6-conta.md) | Área logada, pedidos, preferências |

---

## Regras Globais de Qualidade (aplicar em todas as fases)

### Animações
- Duração micro-interações: **150–300ms**
- Easing entrada: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out)
- Easing saída: `cubic-bezier(0.7, 0, 0.84, 0)` (expo in)
- Spring para modais e sheets: `damping: 20, stiffness: 90`
- Máximo: **2 elementos animados simultaneamente** por viewport
- **Sempre implementar**: `@media (prefers-reduced-motion: reduce)`

### Glass Effects
- Nunca usar `backdrop-blur` em mais de 3 elementos sobrepostos (degradação de performance)
- Sempre testar em Safari (implementação diferente de Chrome)
- Fallback para `background-color` opaco quando blur não suportado

### Acessibilidade
- Contraste mínimo: **4.5:1** para texto normal, **3:1** para texto grande
- Todos os botões com ícone: `aria-label` obrigatório
- Focus rings: visíveis, usando `ring-2 ring-primary/50`
- Não usar cor como único indicador de estado

### Performance
- Todas as imagens: `WebP`, `width`+`height` declarados, `loading="lazy"` (exceto above-fold)
- Animações: apenas `transform` e `opacity` (nunca `width`, `height`, `top`, `left`)
- Blobs aurora: limitar a 2-3 por página, `will-change: transform`

---

## Inspirações Visuais de Referência

> (Conceitos — não copiar, interpretar)

- **Baccarat Rouge 540** — ultra luxo dark, tipografia bold serif, espaço dramatico
- **Maison Margiela Replica** — editorial, texturas, camadas de vidro
- **Byredo** — minimalismo escuro, dourado como acento único, movimento lento e preciso
- **Apple Vision Pro site** — liquid glass nativo, depth, luz ambiente
- **Oud & Bergamot by Jo Malone** — misterioso, quente, textural

---

## Anti-patterns a Evitar

- ❌ Gradientes coloridos vibrantes (fora do sistema gold)
- ❌ Animações decorativas sem propósito semântico
- ❌ Mais de 2 blur layers empilhados
- ❌ Emojis como ícones estruturais
- ❌ Texto em gold claro sobre fundo claro (contraste crítico)
- ❌ Parallax pesado em mobile
- ❌ Tipografia menor que 14px em elementos interativos
- ❌ Hover como único trigger de ações importantes (mobile)

---

*Documento vivo — atualizar conforme cada fase for implementada.*
*Criado em: Março 2026*
