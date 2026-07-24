# Premium Design System — SIS Mainways

> A living style guide for elevating the SIS corporate website into a premium, modern experience while preserving the existing brand identity.

---

## 1. Brand Identity

| Token | Value | Usage |
|-------|-------|-------|
| Primary Blue | `oklch(57% 0.205 255)` / `#0071e3` | CTAs, links, accent highlights |
| Page Background | `oklch(98.8% 0.004 250)` | Main canvas |
| Ink | `oklch(24% 0.018 255)` | Body text |
| Soft Ink | `oklch(49% 0.018 255)` | Secondary text |
| Surface | `oklch(96.8% 0.008 250)` | Cards, panels |
| Footer Dark | `#1d1d1f` | Footer background |

**Rule:** Never introduce new dominant colors. All enhancements come from better layouts, typography, spacing, and subtle effects.

---

## 2. Typography

- **Font Family:** "CoFo Sans", Aptos, "Segoe UI Variable", "Noto Sans Thai", "Thai Sans Neue", sans-serif
- **Display Font:** Same stack, weight 700–900
- **Scale:** Use existing `--text-*` tokens
- **Letter Spacing:** Kickers get `0.12em`, headlines get `-0.02em` for tightness
- **Line Height:** Body `1.58`, headlines `1.1`

---

## 3. Spacing & Layout

- Use existing `--space-*` tokens consistently
- Max content width: `--content-wide: 1160px`
- Section padding: `var(--space-4xl) var(--space-lg)` on desktop
- Card gaps: `var(--space-lg)` to `var(--space-xl)`

---

## 4. Visual Effects

### Shadows
- Soft: `0 4px 24px rgba(0,0,0,0.06)`
- Lift (hover): `0 8px 40px rgba(0,0,0,0.10)`
- Blue glow: `0 4px 20px rgba(0,113,227,0.20)`

### Borders
- Default: `1px solid var(--color-line)` — `oklch(24% 0.018 255 / 10%)`
- Strong: `oklch(24% 0.018 255 / 18%)`

### Gradients
- Page: `linear-gradient(180deg, #ffffff, #f5f5f7 48%, #ffffff)`
- Card: `linear-gradient(180deg, #ffffff, #f9f9fb)`
- Glass: `linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.72))`

### Radii
- Cards: `var(--radius-lg)` (16px)
- Buttons: `var(--radius-pill)` (999px)
- Small elements: `var(--radius-md)` (8px)

---

## 5. Animation & Motion

- **Ease:** `cubic-bezier(0.22, 1, 0.36, 1)` for entrance
- **Duration:** 300–700ms for reveals, 160ms for micro-interactions
- **Reveal pattern:** `opacity 0→1` + `translateY(12px→0)`
- **Hover:** Scale 1.02, shadow lift, 200ms transition
- **Respect `prefers-reduced-motion`**

---

## 6. Component Patterns

### Hero Section
- Full-viewport with parallax background
- Gradient overlay for text legibility
- Typing headline animation
- Service cards panel at bottom-right

### Cards
- White background with subtle border
- Rounded corners (16px)
- Hover: lift shadow + slight scale
- Icon accent color on hover

### Process Steps
- Numbered with `--color-accent`
- Horizontal track on desktop, vertical on mobile
- Subtle connecting line between steps

### Customer Logos
- Infinite marquee scroll
- Grayscale by default, color on hover
- Consistent logo height (40px)

### Footer
- Dark background (`#1d1d1f`)
- Light text
- Compact variant for in-page use

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| Mobile | `< 640px` | Single column, reduced spacing |
| Tablet | `640px – 1024px` | 2-column grids |
| Desktop | `> 1024px` | Full layout |
| Wide | `> 1440px` | Max-width containers |

---

## 8. Imagery

- Use real product/project photos where available
- Rounded corners (`var(--radius-lg)`)
- Subtle border for definition
- Lazy loading for below-fold images
- `object-fit: cover` for consistent framing

---

## 9. Implementation Rules

1. **Preserve existing JSX** — enhance via CSS only when possible
2. **Use existing CSS custom properties** — no new color palette
3. **Additive changes** — add new styles, don't delete old ones
4. **Test builds** — `npm run build` must pass
5. **Bilingual support** — all text via `i18n` translation keys
