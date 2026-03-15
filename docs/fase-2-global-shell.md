# Fase 2 — Global Shell
> Header, Footer, Background System, Page Transitions

**Pré-requisito:** Fase 1 concluída
**Arquivos:** `Header.tsx`, `Footer.tsx`, `App.tsx`, `index.css`

---

## Objetivo

Criar a "casca" do site — os elementos que o usuário vê em todas as páginas.
Quando o shell estiver refinado, o site já vai ter um salto visual perceptível mesmo com as páginas internas ainda não modificadas.

---

## 2.1 — Sistema de Background Global

### Background base com profundidade

O fundo atual é um `#0a0a0a` plano. Vamos adicionar:

**Camadas (de baixo para cima):**
1. `bg-[#080808]` — cor base mais profunda (void)
2. **Noise texture** — pattern SVG com opacity 2.5% (adiciona grão premium)
3. **Aurora blobs globais** — 2-3 blobs de luz ambiente que ficam no layout root
4. **Conteúdo da página**

```tsx
// Layout wrapper em App.tsx — adicionar:
<div className="relative min-h-screen bg-[#080808] overflow-x-hidden">
  {/* Noise texture layer */}
  <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]
    bg-[url('/noise.svg')] bg-repeat" />

  {/* Aurora blobs globais — movimento lento, nunca chamam atenção */}
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {/* Blob 1 - top right */}
    <div className="aurora-blob absolute top-[-20%] right-[-10%]
      w-[600px] h-[600px] bg-[var(--aurora-gold)]" />
    {/* Blob 2 - bottom left */}
    <div className="aurora-blob absolute bottom-[-20%] left-[-15%]
      w-[500px] h-[500px] bg-[var(--aurora-amber)]
      animation-delay-[4s]" />
  </div>

  <Header />
  <main className="relative z-10">
    {/* rotas */}
  </main>
  <Footer />
</div>
```

### Noise SVG (criar em public/noise.svg)

Usar um SVG de ruído baseado em `feTurbulence` — cria textura orgânica sutil que dá a sensação de material físico premium.

---

## 2.2 — Header Redesenhado

### Estado atual
- `bg-background/80` com `backdrop-blur-lg`
- Logo com `text-gradient-gold`
- Navegação com `transition-colors`

### Melhorias propostas

```tsx
// Header.tsx — changes

// 1. SCROLL STATE: Background evolui conforme scroll
// - Topo da página: completamente transparente
// - Após 60px de scroll: glass effect ativado
// - Transição suave com CSS transition

const [scrolled, setScrolled] = useState(false)
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 60)
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])

// Classes do header:
className={cn(
  "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
  scrolled
    ? "glass border-b border-[var(--glass-border)]"
    : "bg-transparent border-b border-transparent"
)}

// 2. LOGO: adicionar micro-animação na entrada
// - Fade-in + translateX na montagem (Framer Motion)
// - Hover: leve glow no texto

// 3. NAVEGAÇÃO DESKTOP: Links refinados
// - Remover underline simples
// - Novo: linha animada que desliza a partir do centro
// - Active state: cor gold + leve glow text
// - Hover: gold muted

// 4. CART BADGE: Pulse animation quando item é adicionado
// - Usar keyframe pulse-gold quando count muda

// 5. MENU MOBILE: Drawer com glass
// - Background: glass-gold effect
// - Items: stagger animation (cada item com 50ms de delay)
// - Fechar: slide para a direita com fade
// - Backdrop: blur sutil no conteúdo de fundo

// 6. SCROLL INDICATOR: Linha de progresso no topo
// - 1px de altura
// - Gradient gold
// - Avança conforme scroll da página
```

### Detalhamento: Nav Link Animation

```css
/* Substituir o underline simples por linha deslizante */
.nav-link {
  position: relative;
  color: hsl(var(--muted-foreground));
  transition: color 200ms var(--ease-out-expo);
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  right: 50%;
  height: 1px;
  background: hsl(var(--gold));
  transition: left 300ms var(--ease-out-expo),
              right 300ms var(--ease-out-expo);
}
.nav-link:hover,
.nav-link[data-active="true"] {
  color: hsl(var(--gold));
}
.nav-link:hover::after,
.nav-link[data-active="true"]::after {
  left: 0;
  right: 0;
}
```

---

## 2.3 — Footer Redesenhado

### Melhorias propostas

```
Layout do footer (atual: básico)

NOVO footer:
┌──────────────────────────────────────────────────────────────┐
│                  [ornamento SVG geométrico]                   │
│                    ESSENCE ÁRABE                              │
│           Perfumaria Árabe Autêntica para o Brasil            │
│                                                               │
│  [Catálogo]  [Sobre]  [WhatsApp]  [Rastrear Pedido]          │
│                                                               │
│  ──────────────────────────────────────────────              │
│  © 2026 ESSENCE Árabe · Todos os direitos reservados          │
│  Feito com amor no Brasil · Fragrâncias do Oriente Médio      │
└──────────────────────────────────────────────────────────────┘
```

- Background: `bg-[#060606]` — tom levemente mais escuro que o base
- Separador topo: ornamento geométrico árabe em SVG (estrela de 8 pontas + linha)
- Logo: maior, com `text-gradient-gold` e tagline em `text-editorial`
- Links: disposição horizontal simples, hover gold
- Bottom bar: separador com gradiente gold

---

## 2.4 — Page Transitions

### Transição entre rotas

Envolver as rotas com AnimatePresence do Framer Motion:

```tsx
// App.tsx
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

const pageVariants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -4 },
}

const pageTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
}

// Dentro do router:
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
  >
    {/* outlet / routes */}
  </motion.div>
</AnimatePresence>
```

---

## 2.5 — Scroll Progress Indicator

```tsx
// Componente ScrollProgress (novo, global)
// Colocar dentro do Header, fixed no topo

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const h = document.documentElement
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100
      setProgress(pct)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[1px]">
      <div
        className="h-full bg-gradient-to-r from-transparent via-gold to-transparent
          transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

---

## 2.6 — Checklist de Conclusão da Fase 2

- [ ] `public/noise.svg` criado (SVG feTurbulence)
- [ ] Layout root em `App.tsx` com aurora blobs globais
- [ ] Header: scroll state (transparente → glass)
- [ ] Header: nav links com linha deslizante animada
- [ ] Header: scroll progress indicator (1px gradiente no topo)
- [ ] Header: cart badge com pulse-gold ao adicionar item
- [ ] Header mobile: drawer com glass + stagger de items
- [ ] `AnimatePresence` para transições de rota
- [ ] Footer redesenhado com ornamento geométrico árabe
- [ ] Testado em 375px, 768px, 1024px, 1440px
- [ ] Header transparente não quebra legibilidade em nenhuma página

---

*Próxima fase: [fase-3-homepage.md](./fase-3-homepage.md)*
