import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          DEFAULT: "hsl(var(--gold))",
          light: "hsl(var(--gold-light))",
          muted: "hsl(var(--gold-muted))",
          pale: "hsl(var(--gold-pale))",
        },
        cream: "hsl(var(--cream, 45 20% 95%))",
        charcoal: "hsl(var(--charcoal, 0 0% 10%))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      fontFamily: {
        display:   ['"Playfair Display"', 'Georgia', 'serif'],
        body:      ['Inter', 'system-ui', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "20px",
        lg: "40px",
        xl: "60px",
      },

      boxShadow: {
        "gold-sm":    "0 0 20px rgba(201, 168, 76, 0.3)",
        "gold-md":    "0 0 40px rgba(201, 168, 76, 0.25)",
        "gold-lg":    "0 0 80px rgba(201, 168, 76, 0.2)",
        "glass":      "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "card":       "0 4px 24px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 12px 40px rgba(0, 0, 0, 0.5)",
        "inner-gold": "inset 0 1px 0 rgba(201, 168, 76, 0.15)",
        // Legacy aliases
        "gold":       "0 4px 30px rgba(201, 168, 76, 0.15)",
        "gold-legacy-lg": "0 8px 40px rgba(201, 168, 76, 0.25)",
      },

      transitionTimingFunction: {
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "expo-in":  "cubic-bezier(0.7, 0, 0.84, 0)",
        "spring":   "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      transitionDuration: {
        "0":   "0ms",
        "250": "250ms",
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "aurora-drift": {
          "0%":   { transform: "translate(0, 0) scale(1)" },
          "33%":  { transform: "translate(30px, -20px) scale(1.05)" },
          "66%":  { transform: "translate(-20px, 15px) scale(0.97)" },
          "100%": { transform: "translate(15px, -10px) scale(1.02)" },
        },
        "float-gentle": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":      { transform: "translateY(-8px) rotate(0.5deg)" },
          "66%":      { transform: "translateY(-4px) rotate(-0.3deg)" },
        },
        "cinema-reveal": {
          from: { opacity: "0", transform: "translateY(24px)", filter: "blur(4px)" },
          to:   { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0.4)" },
          "50%":      { boxShadow: "0 0 0 8px rgba(201, 168, 76, 0)" },
        },
        "progress-fill": {
          from: { width: "0%" },
          to:   { width: "var(--progress-value, 100%)" },
        },
        "light-sweep": {
          from: { left: "-60%" },
          to:   { left: "150%" },
        },
      },

      animation: {
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
        "fade-in":         "fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-up":      "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in":        "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        "shimmer":         "shimmer 2s linear infinite",
        "aurora":          "aurora-drift 8s ease-in-out infinite alternate",
        "float-gentle":    "float-gentle 6s ease-in-out infinite",
        "pulse-gold":      "pulse-gold 2s ease-in-out infinite",
        "cinema-reveal":   "cinema-reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "progress-fill":   "progress-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "light-sweep":     "light-sweep 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
