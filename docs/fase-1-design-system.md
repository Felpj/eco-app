# Fase 1 — Design System Foundation
> Tokens, CSS Custom Properties, Tailwind Config, Efeitos Base

**Pré-requisito:** nenhum
**Desbloqueia:** todas as outras fases
**Arquivos principais:** `src/index.css`, `tailwind.config.ts`

---

## Objetivo

Estabelecer a linguagem visual completa antes de tocar em qualquer componente.
Tudo que for feito nas fases 2–6 vai consumir o que é definido aqui.

---

## 1.1 — CSS Custom Properties (index.css)

### Tokens de Cor (expandir o sistema atual)

```css
:root {
  /* === BACKGROUND SYSTEM === */
  --bg-void:        0 0% 3%;      /* #080808 - profundidade máxima */
  --bg-base:        0 0% 4%;      /* #0a0a0a - fundo atual */
  --bg-elevated:    0 0% 7%;      /* #111111 - cards elevados */
  --bg-surface:     0 0% 10%;     /* #1a1a1a - superfícies interativas */
  --bg-overlay:     0 0% 12%;     /* #1f1f1f - overlays e dropdowns */

  /* === GOLD SYSTEM (refinado) === */
  --gold:           43 60% 54%;   /* #C9A84C - gold principal mais quente */
  --gold-light:     43 70% 66%;   /* #E8C76A - highlights e texto em foco */
  --gold-muted:     40 40% 35%;   /* #8B6E2E - estados secundários */
  --gold-pale:      43 30% 80%;   /* tom muito claro para fondos de input */
  --gold-glow-rgb:  201, 168, 76; /* para rgba() em glow effects */

  /* === GLASS SYSTEM (novo) === */
  --glass-bg:       rgba(255, 255, 255, 0.03);
  --glass-bg-hover: rgba(255, 255, 255, 0.06);
  --glass-border:   rgba(255, 255, 255, 0.08);
  --glass-border-top: rgba(255, 255, 255, 0.15); /* highlight superior */
  --glass-shadow:   0 8px 32px rgba(0, 0, 0, 0.4);

  /* === AURORA / AMBIENT (novo) === */
  --aurora-gold:    rgba(201, 168, 76, 0.12);
  --aurora-amber:   rgba(180, 100, 30, 0.07);
  --aurora-warm:    rgba(255, 220, 140, 0.04);

  /* === TIPOGRAFIA === */
  --font-display:   'Playfair Display', Georgia, serif;
  --font-body:      'Inter', system-ui, sans-serif;
  --font-editorial: 'Cormorant Garamond', Georgia, serif; /* NOVO */

  /* === MOTION TOKENS (novo) === */
  --ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-expo:   cubic-bezier(0.7, 0, 0.84, 0);
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast:  150ms;
  --duration-base:  250ms;
  --duration-slow:  400ms;
  --duration-aurora: 8000ms;
}
```

---

## 1.2 — Utilitários CSS (classes globais)

### Glass Morphism

```css
/* Classe base para qualquer card glass */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  /* Highlight sutil no topo — efeito de luz incidindo */
  box-shadow:
    inset 0 1px 0 var(--glass-border-top),
    var(--glass-shadow);
}

/* Variante gold — para cards de destaque */
.glass-gold {
  background: rgba(201, 168, 76, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 168, 76, 0.2);
  box-shadow:
    inset 0 1px 0 rgba(201, 168, 76, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(201, 168, 76, 0.05);
}

/* Fallback para browsers sem backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass, .glass-gold {
    background: hsl(var(--bg-elevated));
  }
}
```

### Aurora / Ambient Light Blobs

```css
/* Blob de luz ambiente — colocar como elemento absoluto */
.aurora-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  will-change: transform;
  animation: aurora-drift var(--duration-aurora) ease-in-out infinite alternate;
}

@keyframes aurora-drift {
  0%   { transform: translate(0, 0) scale(1); }
  33%  { transform: translate(30px, -20px) scale(1.05); }
  66%  { transform: translate(-20px, 15px) scale(0.97); }
  100% { transform: translate(15px, -10px) scale(1.02); }
}
```

### Texto Editorial (Cormorant)

```css
.text-editorial {
  font-family: var(--font-editorial);
  font-style: italic;
  font-weight: 300;
  letter-spacing: 0.02em;
  line-height: 1.6;
}

/* Para citações e descrições de fragrância */
.text-scent {
  font-family: var(--font-editorial);
  font-style: italic;
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: hsl(var(--gold-light));
  opacity: 0.85;
}
```

### Glow Effects (refinados)

```css
/* Remover os atuais e substituir por sistema coerente */
.glow-sm    { box-shadow: 0 0 20px rgba(var(--gold-glow-rgb), 0.3); }
.glow-md    { box-shadow: 0 0 40px rgba(var(--gold-glow-rgb), 0.25); }
.glow-lg    { box-shadow: 0 0 80px rgba(var(--gold-glow-rgb), 0.2); }
.glow-text  { text-shadow: 0 0 30px rgba(var(--gold-glow-rgb), 0.4); }

/* Gradient text (manter o existente mas refinar) */
.text-gradient-gold {
  background: linear-gradient(
    135deg,
    hsl(var(--gold-light)) 0%,
    hsl(var(--gold)) 50%,
    hsl(var(--gold-muted)) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Ornamento Geométrico Árabe (SVG utilitário)

```css
/* Uso: <div class="section-ornament" /> */
.section-ornament {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, hsl(var(--gold)), transparent);
  margin: 0 auto;
}

/* Variante com ponto central */
.section-ornament-dot::before,
.section-ornament-dot::after {
  content: '';
  display: block;
  width: 30px;
  height: 1px;
  background: hsl(var(--gold));
}
.section-ornament-dot {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}
.section-ornament-dot span {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: hsl(var(--gold));
}
```

### Noise Texture (profundidade)

```css
/* Adicionar ao body ou a seções específicas para textura sutil */
.texture-noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise gerado */
  opacity: 0.025;
  pointer-events: none;
}
```

---

## 1.3 — Animações Globais (keyframes)

```css
/* Reveal cinematográfico — principal entrada de conteúdo */
@keyframes cinema-reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* Shimmer de carregamento (manter, refinar cor) */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Pulsação suave (para badges e indicadores) */
@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--gold-glow-rgb), 0.4); }
  50%       { box-shadow: 0 0 0 8px rgba(var(--gold-glow-rgb), 0); }
}

/* Float refinado (para produto hero) */
@keyframes float-gentle {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-8px) rotate(0.5deg); }
  66%       { transform: translateY(-4px) rotate(-0.3deg); }
}

/* Linha de progressão (para free shipping, steps) */
@keyframes progress-fill {
  from { width: 0%; }
  to   { width: var(--progress-value, 100%); }
}

/* Reduced motion — override global */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 1.4 — Tailwind Config (tailwind.config.ts)

### Novos tokens a adicionar

```typescript
// tailwind.config.ts
extend: {
  fontFamily: {
    display:   ['Playfair Display', 'Georgia', 'serif'],
    body:      ['Inter', 'system-ui', 'sans-serif'],
    editorial: ['Cormorant Garamond', 'Georgia', 'serif'], // NOVO
  },

  colors: {
    // Manter os existentes + adicionar:
    gold: {
      DEFAULT: 'hsl(var(--gold))',
      light:   'hsl(var(--gold-light))',
      muted:   'hsl(var(--gold-muted))',
      pale:    'hsl(var(--gold-pale))',
    },
    glass: {
      DEFAULT: 'var(--glass-bg)',
      border:  'var(--glass-border)',
    },
  },

  backdropBlur: {
    xs: '4px',
    sm: '8px',
    DEFAULT: '12px',
    md: '20px',
    lg: '40px',
    xl: '60px',
  },

  animation: {
    // Manter existentes + adicionar:
    'aurora':        'aurora-drift 8s ease-in-out infinite alternate',
    'float-gentle':  'float-gentle 6s ease-in-out infinite',
    'pulse-gold':    'pulse-gold 2s ease-in-out infinite',
    'cinema-reveal': 'cinema-reveal 0.6s var(--ease-out-expo) forwards',
  },

  transitionTimingFunction: {
    'expo-out':   'cubic-bezier(0.16, 1, 0.3, 1)',
    'expo-in':    'cubic-bezier(0.7, 0, 0.84, 0)',
    'spring':     'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  boxShadow: {
    // Substituir shadow-gold existente por sistema:
    'gold-sm':  '0 0 20px rgba(201, 168, 76, 0.3)',
    'gold-md':  '0 0 40px rgba(201, 168, 76, 0.25)',
    'gold-lg':  '0 0 80px rgba(201, 168, 76, 0.2)',
    'glass':    '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
    'card':     '0 4px 24px rgba(0, 0, 0, 0.3)',
    'card-hover': '0 12px 40px rgba(0, 0, 0, 0.5)',
    'inner-gold': 'inset 0 1px 0 rgba(201, 168, 76, 0.15)',
  },
}
```

---

## 1.5 — Google Fonts (adicionar ao index.html)

```html
<!-- Adicionar Cormorant Garamond -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

---

## 1.6 — Checklist de Conclusão da Fase 1

- [ ] CSS custom properties atualizados em `index.css`
- [ ] Classes `.glass` e `.glass-gold` implementadas com fallback
- [ ] Classes `.aurora-blob` e keyframe `aurora-drift` criados
- [ ] Classes `.text-editorial` e `.text-scent` criadas
- [ ] Sistema de glow unificado (`.glow-sm/md/lg`)
- [ ] Ornamentos SVG (`.section-ornament`) implementados
- [ ] Keyframes: `cinema-reveal`, `float-gentle`, `pulse-gold`, `progress-fill`
- [ ] `@media (prefers-reduced-motion)` global implementado
- [ ] `tailwind.config.ts` atualizado com novos tokens
- [ ] Cormorant Garamond adicionado ao `index.html`
- [ ] Testado em Chrome, Safari, Firefox (backdrop-filter)

---

*Tempo estimado: 1 sessão de desenvolvimento*
*Próxima fase: [fase-2-global-shell.md](./fase-2-global-shell.md)*
