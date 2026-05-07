// tailwind.config.js — ITEC.BA paleta completa + glassmorphism + bento
/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Palette base ──────────────────────────────────────────────────
        "itec-bg":      "#111113",   // fondo raíz (más oscuro, mejor contraste)
        "itec-text":    "#E5E6EA",   // texto principal
        "itec-accent":  "#D41313",   // rojo ITEC
        "itec-primary": "#022A5E",   // azul oscuro
        "itec-gray":    "#474747",   // gris medio

        // ── Superficies (dark-glass hierarchy) ────────────────────────────
        "itec-sidebar":  "#161618",  // sidebar/nav bg
        "itec-box":      "#1C1C1E",  // cards / contenedores primarios
        "itec-box2":     "#242426",  // contenedores secundarios
        "itec-surface":  "#2A2A2D",  // inputs, hover states
        "itec-border":   "#2E2E32",  // bordes sutiles

        // ── Semánticos ────────────────────────────────────────────────────
        "itec-muted":    "#6B6B75",  // texto secundario

        // ── Azules ────────────────────────────────────────────────────────
        "itec-sky":       "#38BDF8", // azul cielo / links
        "itec-blue":      "#2563EB", // azul acción
        "itec-blue-skye": "#0EA5E9", // azul vibrante

        // ── Accentos semánticos ───────────────────────────────────────────
        "itec-amber":    "#F59E0B",  // puntos / dorado
        "itec-emerald":  "#10B981",  // éxito / aprobada
        "itec-purple":   "#A855F7",  // digital / IA
        "itec-groups":   "#059669",  // grupos / verde oscuro
        "itec-red":      "#EF4444",  // errores / crítico
        "itec-red-skye": "#F87171",  // rojo suave

        // ── Legado (compatibilidad con componentes existentes) ────────────
        itecBlue: { DEFAULT: "#3B82F6", dark: "#2563EB" },
        bgMain:   "#F3F4F6",

        // ── Glassmorphism token ───────────────────────────────────────────
        "glass-border":  "rgba(255,255,255,0.08)",
      },

      // ── Box shadows glassmorphism ────────────────────────────────────────
      boxShadow: {
        glass:    "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-lg": "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        sky:      "0 0 24px rgba(56,189,248,0.18)",
        accent:   "0 0 24px rgba(212,19,19,0.18)",
        amber:    "0 0 24px rgba(245,158,11,0.18)",
        emerald:  "0 0 24px rgba(16,185,129,0.18)",
        purple:   "0 0 24px rgba(168,85,247,0.18)",
        "inner-sm": "inset 0 1px 0 rgba(255,255,255,0.04)",
      },

      // ── Backdrop blur ─────────────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },

      // ── Border radius ─────────────────────────────────────────────────────
      borderRadius: {
        "4xl":  "2rem",
        "5xl":  "2.5rem",
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ["Plus Jakarta Sans", "Inter", "sans-serif"],
        display: ["Syne", "Plus Jakarta Sans", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },

      // ── Keyframes ─────────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
        blink: {
          "0%, 100%": { opacity: "0.2" },
          "50%":      { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(56,189,248,0.3)" },
          "50%":      { boxShadow: "0 0 20px rgba(56,189,248,0.6)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%":      { transform: "translateX(4px)" },
        },
      },
      animation: {
        "fade-in":        "fade-in 0.3s ease-out forwards",
        "fade-up":        "fade-up 0.4s ease-out forwards",
        "slide-in-left":  "slide-in-left 0.3s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
        "scale-in":       "scale-in 0.25s ease-out forwards",
        blink:            "blink 0.8s ease-in-out infinite",
        "glow-pulse":     "glow-pulse 2s ease-in-out infinite",
        shimmer:          "shimmer 2.5s linear infinite",
        "spin-slow":      "spin-slow 3s linear infinite",
        "bounce-x":       "bounce-x 1s ease-in-out infinite",
      },

      // ── Spacing extras ────────────────────────────────────────────────────
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "safe": "env(safe-area-inset-bottom, 0.5rem)",
      },

      // ── Grid cols para bento ──────────────────────────────────────────────
      gridTemplateColumns: {
        "bento-3": "repeat(3, minmax(0, 1fr))",
        "bento-4": "repeat(4, minmax(0, 1fr))",
        "bento-5": "repeat(5, minmax(0, 1fr))",
        "profile": "1fr 2fr",
        "admin":   "14rem 1fr",
      },

      // ── Transition timing ─────────────────────────────────────────────────
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },

      // ── Width extras ──────────────────────────────────────────────────────
      width: {
        "55": "13.75rem",
        "62": "15.5rem",
      },

      // ── Screens extras ───────────────────────────────────────────────────
      screens: {
        "xs":  "375px",
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
