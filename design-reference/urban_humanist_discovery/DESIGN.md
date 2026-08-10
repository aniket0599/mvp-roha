---
name: Urban Humanist Discovery
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#424844'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#727973'
  outline-variant: '#c2c8c2'
  surface-tint: '#496455'
  primary: '#173124'
  on-primary: '#ffffff'
  primary-container: '#2d4739'
  on-primary-container: '#98b5a3'
  inverse-primary: '#b0cdbb'
  secondary: '#99462a'
  on-secondary: '#ffffff'
  secondary-container: '#fe9572'
  on-secondary-container: '#762c12'
  tertiary: '#2c2c28'
  on-tertiary: '#ffffff'
  tertiary-container: '#42423d'
  on-tertiary-container: '#b0aea8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ccead6'
  primary-fixed-dim: '#b0cdbb'
  on-primary-fixed: '#062014'
  on-primary-fixed-variant: '#324c3e'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59e'
  on-secondary-fixed: '#390b00'
  on-secondary-fixed-variant: '#7a2f15'
  tertiary-fixed: '#e5e2db'
  tertiary-fixed-dim: '#c9c6c0'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#474742'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system is rooted in the "Modern Editorial" aesthetic—a synthesis of high-end print journalism and contemporary digital utility. It targets a socially intelligent audience seeking meaningful connection over gamified interaction. 

The visual narrative is **Human, Warm, and Curious**. It avoids the frenetic energy of typical social platforms in favor of a composed, rhythmic layout that prioritizes whitespace and intellectual clarity. The style utilizes **Minimalism** with a **Tactile** edge, ensuring digital components feel like premium stationery or heavy-stock paper. The emotional response should be one of calm, focused discovery and understated prestige.

## Colors
The palette is inspired by natural materials and architectural finishes. 

*   **Primary (Forest Green):** Used for "Socially Available" indicators and key calls to action. It represents growth and groundedness.
*   **Secondary (Terracotta):** An accent for interactive highlights and notifications, providing warmth without the urgency of "error red."
*   **Background (Oatmeal/Cream):** The tertiary `#F4F1EA` serves as the primary canvas, reducing eye strain and providing a sophisticated alternative to pure white.
*   **Neutral (Charcoal):** Used for typography and structural borders to ensure high legibility and a "print" feel.

Avoid gradients. Use solid fills or subtle tonal shifts to maintain an editorial discipline.

## Typography
The typography system follows a traditional editorial hierarchy. **Playfair Display** provides the distinctive, authoritative voice for headlines and profile names. **Hanken Grotesk** is chosen for its contemporary precision and high legibility in body copy and metadata.

Large display titles should use tighter letter-spacing for a "masthead" appearance. Body text requires generous line-height to ensure a relaxed reading experience. Use "label-caps" sparingly for secondary metadata or section headers to create visual anchors on the page.

## Layout & Spacing
The layout uses a **Fixed Grid** philosophy on desktop and a **Fluid Grid** on mobile. 

- **Desktop:** 12-column grid with a 1200px max-width to maintain the feel of a magazine spread.
- **Mobile:** 4-column grid with 20px margins.
- **Rhythm:** All spacing must be multiples of 8px. Use generous vertical "stack" spacing (48px+) between major sections to allow the content to breathe.

Information should be grouped in logical blocks (cards) that align strictly to the grid, avoiding cluttered or overlapping elements.

## Elevation & Depth
This design system rejects heavy shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. 

Depth is communicated through:
1.  **Subtle Bordering:** Use 1px solid strokes in a slightly darker shade of the background color (e.g., a taupe stroke on oatmeal background) to define card boundaries.
2.  **Tiers:** The base canvas is the Oatmeal tertiary color; active cards or modals use a pure white surface to appear "lifted."
3.  **Shadows:** When necessary for functional overlays, use "Ambient Shadows"—highly diffused, 20% opacity charcoal with a large (24px+) blur and no offset, simulating paper resting on a surface.

## Shapes
The shape language is **Soft (0.25rem)**. While modern, it avoids the hyper-rounded "bubbly" appearance of mass-market social apps to maintain its premium, urban edge.

- **Standard Elements:** 4px (0.25rem) radius for buttons and small input fields.
- **Cards & Containers:** 8px (0.5rem) radius to provide a distinct but structured container.
- **Profile Avatars:** Use soft-squares (8px radius) rather than perfect circles to maintain the architectural, print-media aesthetic.

## Components
- **Buttons:** Primary buttons use a solid Forest Green fill with white Hanken Grotesk type. Secondary buttons use a fine 1px Charcoal border. All buttons use a fixed height (48px) for a substantial, tactile feel.
- **Cards:** Profile and discovery cards use a white background against the oatmeal canvas. They feature 1px strokes and no heavy shadows. Photography within cards should have a consistent 4px corner radius.
- **Chips/Tags:** Used for interests and availability. These should be low-contrast, using a light grey-taupe fill with charcoal text.
- **Input Fields:** Minimalist design. A bottom-border only (print-style) or a very light 1px stroke. Labels are always visible in "label-caps" style.
- **Privacy Indicators:** A dedicated "Privacy Shield" icon paired with the Forest Green color to denote "Verified" or "Encrypted" status, presented with understated typography.
- **Lists:** High-density information lists should use generous horizontal padding (24px) and thin dividers to separate items, mimicking a table of contents.