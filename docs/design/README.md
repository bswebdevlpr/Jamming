# Design Guide

> Project design system and style guide

## Core Principles

**When working on the frontend or creating design elements, you must never disrupt the overall mood of the project (color palette, typography system, dark mode tone).**

- When adding new components or styles, always follow the design tokens and patterns defined below
- Do not use arbitrary colors outside the approved color list
- Do not use fonts other than the defined typography
- Maintain the dark, dark-mode-based tone, and avoid bright backgrounds or excessive use of color

## CSS Variables (Design Tokens)

Core tokens defined in `:root` of `app/ui/global.css`:

| Variable | Value | Purpose |
|------|-----|------|
| `--background` | `#111113` | App background (near black) |
| `--foreground` | `#ededed` | Default text (near white) |
| `--highlight` | `#a3ff0c` | Brand accent color (yellow green) |
| `--border` | `#323234` | Default border |
| `--min-width` | `375px` | Minimum viewport width |
| `--max-width` | `600px` | Maximum viewport width |
| `--font-size` | `14px` | Default font size |
| `--vh` | `1vh` | iOS Safari viewport height unit |

## Color Palette

### Brand/Accent

| Color | HEX | Purpose |
|-------|-----|------|
| Highlight (Green) | `#A3FF0C` | Active state, selected state, genre tags, brand accent |
| Blue | `#0C7CFF` | Switch active, secondary accent |
| Location Blue | `#3994FF` | Location tags |
| Pink | `#FF3773` | Position tags |
| Red | `#FF3E2F` | Delete, warning |

### Neutrals (Gray Scale)

| Color | HEX | Purpose |
|-------|-----|------|
| Background | `#111113` | App background |
| Deep BG | `#242426` | Card background, level tag background |
| Border / Inactive BG | `#323234` | Border, inactive button background, select background |
| Dark Gray | `#444447` | Inactive border, switch inactive background |
| Mid Gray (Border) | `#535355` | Button border |
| Mid Gray (Text) | `#9F9FA2` | Inactive text, secondary text, switch inactive thumb |
| Light Gray | `#c0c0c5` | Default English font color |
| Near White | `#E5E5E9` | Default Korean font color, level tag text |
| Foreground | `#ededed` | Default text |

### Semantic Backgrounds (With Transparency)

Semi-transparent backgrounds used for tags and interactions:

| Purpose | Value |
|------|-----|
| Genre tag background | `rgba(163, 255, 12, 0.16)` |
| Hover/Tap effect | `rgba(163, 255, 12, 0.12)` |
| Active button background | `#304313` |
| Position tag background | `rgba(255, 55, 115, 0.24)` |
| Location tag background | `rgba(12, 124, 255, 0.20)` |
| Level tag background | `#242426` |

## Typography

### Font Families

#### English Font (SBAggro)

| Font | Weight | Purpose |
|-------|------|------|
| `SBAggroL` | Light | Large text, branding |
| `SBAggroM` | Medium | General UI elements |
| `SBAggroB` | Bold | Emphasis |

Recommended styles (applied in actual use):
- Text color: `#c0c0c5`
- Letter spacing: `0`
- Line height: `140%`

Font loading strategy: All fonts are set with `font-display: swap`.

#### Korean Font (SUIT)

| Font | Weight | Purpose |
|-------|------|------|
| `SUIT-TITLE` | SemiBold | Titles, labels |
| `SUIT-BODY` | Regular | Body text, buttons, tags |

Common properties: `color: #e5e5e9`, `letter-spacing: -2.5%`, `line-height: 140~150%`

#### Auxiliary Font (Pretendard)

Consolidated into a single font-family, with weight controlled via font-weight.

| font-weight | Weight | Purpose |
|-------------|------|------|
| `400` | Regular | Material UI calendar, secondary text |
| `500` | Medium | General UI |
| `600` | SemiBold | Emphasis |

**Usage example**: `font-family: "Pretendard"; font-weight: 500;`

### Font Size Guide

| Size | Purpose |
|------|------|
| `1rem` (16px) | Button text, input fields |
| `0.875rem` (14px) | Labels, select items |
| `0.75rem` (12px) | Tags, secondary text |

## Layout

### Viewport Constraints

- **Minimum width**: 375px (based on iPhone SE)
- **Maximum width**: 600px (mobile web only)
- **Horizontal centering**: `margin: 0 auto`
- **Full height**: `height: 100%`

### Scroll

```css
/* Scrollbar hiding utility */
.overflow-without-scroll {
  overflow: auto;
  -ms-overflow-style: none;    /* IE/Edge */
  scrollbar-width: none;        /* Firefox */
}
.overflow-without-scroll::-webkit-scrollbar {
  display: none;                /* Chrome, Safari */
}
```

## Component Style Specifications

### Button (`app/ui/templates/buttons.tsx`)

Common styles:

| Property | Value |
|------|-----|
| `width` | `100%` |
| `borderRadius` | `8px` |
| `padding` | `10px 12px` |
| `fontFamily` | `SUIT-BODY` |
| `fontSize` | `1rem` |

Styles by state:

| State | Text Color | Border | Background |
|------|-----------|------|------|
| Inactive | `#9F9FA2` | `1px solid #444447` | `#323234` |
| Active | `#A3FF0C` | `1px solid #A3FF0C` | `#304313` |

### Tag (`app/ui/tags/category-tag.tsx`)

Common styles:

| Property | Value |
|------|-----|
| `fontFamily` | `SUIT-BODY` |
| `fontSize` | `0.75rem` |
| `borderRadius` | `2px` |
| `padding` | `px-1.5 py-0.5` |
| `whiteSpace` | `nowrap` |

Colors by tag type:

| Type | Text Color | Background |
|------|-----------|------|
| Position | `#FF3773` | `rgba(255, 55, 115, 0.24)` |
| Genre | `#A3FF0C` | `rgba(163, 255, 12, 0.16)` |
| Location | `#3994FF` | `rgba(12, 124, 255, 0.20)` |
| Level | `#E5E5E9` | `#242426` |

Tag display order: Location → Position → Genre → Level

### Switch (`app/ui/templates/switch.tsx`)

Based on Radix UI Switch:

| Property | Value |
|------|-----|
| Root size | `51px × 26px` |
| Thumb size | `22px × 22px` |
| `borderRadius` | `9999px` |
| Transition | `transform 200ms` |

Styles by state:

| State | Root Background | Thumb Color | Thumb Position |
|------|-----------|----------|------------|
| Off | `#444447` | `#9F9FA2` | `translateX(2px)` |
| On | `#0C7CFF` | `#FFF` | `translateX(27px)` |

### Select (`app/ui/templates/select.tsx`)

Based on Radix UI Select:

| Property | Value |
|------|-----|
| Size | `164px × 33px` |
| `backgroundColor` | `#323234` |
| `borderRadius` | `3px` |
| Item border | `1px solid #9F9FA2` |
| `fontFamily` | `SUIT-BODY` |
| `fontSize` | `0.875rem` |

## Animation (Framer Motion)

Framer Motion is used for interaction effects:

```typescript
// Hover effect
whileHover={{ background: "rgba(163, 255, 12, 0.12)" }}

// Tap effect
whileTap={{ background: "rgba(163, 255, 12, 0.12)" }}
```

Switch transition:
```css
transition: transform 200ms;
will-change: transform;
```

## iOS Safari Handling

### Preventing Input Field Auto-Zoom

Applied to all `input`, `textarea`, and `select` elements (`app/ui/global.css`):

```css
input, textarea, select {
  font-size: 16px;            /* Must be at least 16px */
  -webkit-appearance: none;
  appearance: none;
  box-sizing: border-box;
}

input::placeholder, textarea::placeholder {
  font-size: 16px;
  opacity: 0.6;
}
```

### Viewport Height

Uses the `--vh` CSS variable to handle iOS Safari address bar height changes.

## UI Library Dependencies

Radix UI primitives are used for accessibility:

| Package | Purpose |
|--------|------|
| `@radix-ui/react-avatar` | Avatar |
| `@radix-ui/react-switch` | Toggle switch |
| `@radix-ui/react-select` | Select dropdown |
| `@radix-ui/react-checkbox` | Checkbox |

## Related Files

| File | Description |
|------|------|
| `app/ui/global.css` | CSS variables, font definitions, global styles |
| `tailwind.config.ts` | Tailwind theme extensions (`background`, `foreground`) |
| `app/ui/templates/buttons.tsx` | Button template |
| `app/ui/tags/category-tag.tsx` | Tag component (4 types) |
| `app/ui/templates/switch.tsx` | Switch component |
| `app/ui/templates/select.tsx` | Select component |

## Related Documentation

- [Context](../context/README.md) - Project context
- [Architecture](../architecture/README.md) - System structure
- [Patterns](../patterns/README.md) - Code patterns
