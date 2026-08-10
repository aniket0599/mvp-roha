import type { Config } from "tailwindcss";

/**
 * Design tokens from the "Urban Humanist Discovery" system (DESIGN.md).
 * Modern-editorial aesthetic: Playfair Display + Hanken Grotesk,
 * forest green primary on an oatmeal/cream canvas with a terracotta accent.
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fcf9f8",
        "on-background": "#1c1b1b",
        surface: "#fcf9f8",
        "surface-dim": "#dcd9d9",
        "surface-bright": "#fcf9f8",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f2",
        "surface-container": "#f0eded",
        "surface-container-high": "#eae7e7",
        "surface-container-highest": "#e5e2e1",
        "surface-variant": "#e5e2e1",
        "on-surface": "#1c1b1b",
        "on-surface-variant": "#424844",
        "inverse-surface": "#313030",
        "inverse-on-surface": "#f3f0ef",
        outline: "#727973",
        "outline-variant": "#c2c8c2",
        "surface-tint": "#496455",
        primary: "#173124",
        "on-primary": "#ffffff",
        "primary-container": "#2d4739",
        "on-primary-container": "#98b5a3",
        "inverse-primary": "#b0cdbb",
        secondary: "#99462a",
        "on-secondary": "#ffffff",
        "secondary-container": "#fe9572",
        "on-secondary-container": "#762c12",
        tertiary: "#2c2c28",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#42423d",
        "on-tertiary-container": "#b0aea8",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "primary-fixed": "#ccead6",
        "primary-fixed-dim": "#b0cdbb",
        "on-primary-fixed": "#062014",
        "on-primary-fixed-variant": "#324c3e",
        "success": "#2f7d4f",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-hanken)", "Hanken Grotesk", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        unit: "8px",
        "stack-sm": "12px",
        "stack-md": "24px",
        "stack-lg": "48px",
        gutter: "24px",
        "margin-mobile": "20px",
        "margin-desktop": "40px",
      },
      maxWidth: {
        container: "1200px",
        phone: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
