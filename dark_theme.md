# Design System: "Mildest" AI Chat Agent Landing Page

> Values are estimated from a screenshot. Verify exact hex and px values in your design tool.

## 1. Design Principles
- **Dark, calm, editorial.** Near-black canvas with high-contrast white type, so the illustrations carry all the color.
- **Serif meets sans.** An elegant serif for headlines adds warmth to a technical AI product.
- **Illustration as UI backdrop.** Hand-painted, flat-gouache nature scenes sit behind clean white product mockups.
- **Pill-shaped everything.** Buttons, badges, and chips are fully rounded.

## 2. Color

| Token | Value (approx.) | Usage |
|---|---|---|
| `bg-base` | `#0A0A0A` | Page/frame background |
| `bg-surface` | `#141414` | Input fields, subtle panels |
| `bg-elevated` | `#1C1C1C` | Dark chips, hover states |
| `text-primary` | `#FFFFFF` | Headlines, key labels |
| `text-secondary` | `#B8B8B8` | Subheads, nav links |
| `text-muted` | `#7A7A7A` | Card descriptions, captions |
| `border-subtle` | `rgba(255,255,255,0.25)` | Badge outlines, dividers |
| `btn-primary-bg` | `#FFFFFF` | CTA fill |
| `btn-primary-text` | `#0A0A0A` | CTA label |
| `chat-light-bg` | `#FFFFFF` | Chat mockup cards |
| `chat-user-bubble` | `#111111` | User message bubbles |
| `chip-gray` | `#B5B5B5` | Suggestion chips in light cards |

**Illustration palette**
- Forest green `#2F6B3A`
- Leaf green `#4E9A4B`
- Terracotta `#C8623C`
- Burnt orange `#E58A3A`
- Dusty pink `#D98BA8`
- Sky blue `#8EC5E8`
- Cream `#F2E6C8`
- Deep indigo mountain `#2B2A44`

## 3. Typography

| Role | Font | Size / Weight | Notes |
|---|---|---|---|
| Display / H1 | Serif (Lora-style) | 40–44px / 500 | Line-height 1.05, tight tracking |
| H2 | Serif (Lora-style) | 28–30px / 500 | Centered, 2 lines |
| Hero overlay greeting | Sans (Inter/Helvetica-style) | 22–24px / 400 | White plus gray second line |
| Card title | Sans | 13px / 500 | White |
| Body / subhead | Sans | 10–11px / 400 | `text-secondary`, line-height 1.5 |
| Nav link | Sans | 9–10px / 400 | `text-secondary` |
| Badge / chip label | Sans | 8–9px / 500 | |
| Chat text | Sans | 9–10px / 400 | |

Suggested pairing: **Lora** (or Playfair / Newsreader) for headings, **Inter** for UI text.

## 4. Spacing and Layout
- **Grid:** 4px base unit. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- **Container:** ~88% of frame width, centered. Content max-width ~1100px at desktop scale.
- **Outer frame:** dark page sits inside a rounded container (radius ~12px) floating on an illustrated background.
- **Hero:** two-column split. Left is text, right is a large illustration panel (~55% width) bleeding toward the right edge.
- **Section spacing:** ~80–96px.
- **Feature cards:** 3-column grid, 12px gap, equal width.

## 5. Radius and Borders

| Token | Value | Usage |
|---|---|---|
| `radius-pill` | 999px | Buttons, badges, chips, chat bubbles |
| `radius-lg` | 16px | Feature cards, hero image |
| `radius-md` | 12px | Chat mockup cards, inputs |
| `radius-frame` | 12px | Outer page container |

Borders are 1px hairlines at low-opacity white. No heavy shadows; depth comes from contrast.

## 6. Components

### Navbar
- Logo (asterisk/sparkle icon + wordmark) on the left.
- Centered links: About, Features, Pages (chevron), Pricing, Blog.
- Right: small circular cart/icon button + white pill "Get Started ↗".

### Primary Button (pill)
- White fill, dark text, 12px medium, padding ~8×16px, trailing ↗ icon.
- Hover: slight opacity drop or scale 1.02.

### Badge / Eyebrow Pill
- Transparent fill, 1px `border-subtle`, white 9px text.
- Optional icon box on the right (e.g. "Works With Any AI Agents ↗").
- Also used for section labels like "Product Overview".

### Hero Search/Chat Input
- Dark panel (`bg-surface`, radius 12px), placeholder "Ask anything…".
- Bottom row: pill toggles "Search" (active, lighter gray) and "Research" on the left; tiny circular icon buttons on the right, last one highlighted.
- Below: row of dark suggestion chips with icons (Parenting, Current Events, Health, Research, Sports).

### Trust Bar
- Centered text: "Trusted By Over 4900+ Users (4.9/5 Based On Reviews)".
- Row of monochrome gray logos at ~60% opacity.

### Feature Card
- Illustrated backdrop (radius 16px) containing a white chat mockup cropped at the bottom edge.
- Below: title (white, 13px) and description (muted, 10px, 2 lines).

### Chat Mockup
- White card, radius 12px.
- User bubbles: black pills, right-aligned, small avatar.
- AI messages: plain text with a small black circular logo avatar.
- Nested result card (flight): light border, logo, times, bold price.
- Gray rounded chips for suggested prompts.

### Hero Illustration Panel
- Full-bleed painted landscape (mountains, wildflowers, winding path).
- Top gradient from black to transparent to blend with the page.
- Overlaid greeting in white and gray.

## 7. Imagery and Iconography
- **Style:** flat gouache / paper-cut nature scenes, color-blocked, no outlines. Saturated, warm foreground, cool background.
- **Icons:** thin-stroke (1.5px), rounded line icons at 10–14px, monochrome white or gray.
- **Logo mark:** 8-point asterisk/sparkle glyph.

## 8. Motion (suggested)
- Fade-up on scroll (~400ms, ease-out).
- Subtle parallax on illustrations.
- Hover: chips and buttons brighten or lift 1–2px.
- Typing/streaming animation in chat mockups.

## 9. Design Tokens (CSS)

```css
:root {
  --bg-base: #0a0a0a;
  --bg-surface: #141414;
  --bg-elevated: #1c1c1c;
  --text-primary: #ffffff;
  --text-secondary: #b8b8b8;
  --text-muted: #7a7a7a;
  --border-subtle: rgba(255,255,255,.25);

  --font-serif: "Lora", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;

  --radius-pill: 999px;
  --radius-lg: 16px;
  --radius-md: 12px;

  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;
  --space-12: 48px; --space-24: 96px;
}
```