# Milano Sweets — Brand & Design System
**Version:** 1.0  
**Date:** May 2026  
**Scope:** Customer Website + Admin Dashboard

---

## 1. Brand Identity

### Personality
Milano Sweets هو براند **فاخر، ملكي، أصيل**. الـ visual identity مبنية على تناقض قوي: خلفية سوداء عميقة + تفاصيل ذهبية. الإحساس = محل راقي في قلب المنصورة، مش سوبرماركت ومش café عادي.

### Brand Keywords
`فاخر` · `ملكي` · `أصيل` · `دافئ` · `احترافي`

---

## 2. Color Palette

### Primary Brand Colors
| Token | Hex | الاستخدام |
|-------|-----|-----------|
| `--color-gold` | `#C9A84C` | Primary accent — CTAs, prices, highlights |
| `--color-gold-light` | `#E8D5A0` | Headings on dark bg, hover states |
| `--color-gold-dark` | `#8A6F28` | Gold borders, dividers, subtle accents |

### Background Colors
| Token | Hex | الاستخدام |
|-------|-----|-----------|
| `--color-bg-base` | `#0D0D0D` | Page background, hero sections |
| `--color-bg-surface` | `#1A1A1A` | Cards, nav, sidebars |
| `--color-bg-card` | `#242424` | Product cards, list items |
| `--color-bg-elevated` | `#2E2E2E` | Modals, dropdowns, tooltips |

### Text Colors
| Token | Hex | الاستخدام |
|-------|-----|-----------|
| `--color-text-primary` | `#FAFAFA` | Main body text |
| `--color-text-accent` | `#C9A84C` | Prices, labels, links |
| `--color-text-muted` | `#B0B0B0` | Secondary text, descriptions |
| `--color-text-disabled` | `#666666` | Disabled states |

### Border Colors
| Token | Value | الاستخدام |
|-------|-------|-----------|
| `--color-border-default` | `#2A2A2A` | Card borders, dividers |
| `--color-border-subtle` | `#1E1E1E` | Subtle separators |
| `--color-border-gold` | `#C9A84C44` | Gold-tinted borders (44 = 27% opacity) |
| `--color-border-gold-strong` | `#C9A84C88` | Emphasis borders |

### Semantic / Status Colors
| Token | Hex | الاستخدام |
|-------|-----|-----------|
| `--color-success` | `#2D6A4F` | تم التوصيل, متاح |
| `--color-success-text` | `#4CAF50` | Text on success bg |
| `--color-error` | `#C0392B` | خطأ, ملغي |
| `--color-error-text` | `#E57373` | Text on error bg |
| `--color-warning` | `#B7770D` | تحذير |
| `--color-info` | `#1A6FA8` | معلومات |

---

## 3. Typography

### Font Families

```css
--font-display: 'Playfair Display', serif;   /* English brand name */
--font-arabic: 'Cairo', sans-serif;           /* All Arabic text */
--font-mono: 'Courier New', monospace;        /* Order numbers, codes */
```

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cairo:wght@400;600;700&display=swap');
```

### Type Scale

| Role | Font | Size | Weight | Color |
|------|------|------|--------|-------|
| Brand / Logo | Playfair Display | 32–48px | 700 | `#C9A84C` |
| H1 Arabic | Cairo | 28–32px | 700 | `#FAFAFA` |
| H2 Arabic | Cairo | 20–24px | 600 | `#E8D5A0` |
| H3 / Card title | Cairo | 16–18px | 600 | `#FAFAFA` |
| Body | Cairo | 14–15px | 400 | `#B0B0B0` |
| Price | Cairo | 18–24px | 700 | `#C9A84C` |
| Badge / Label | Cairo | 10–12px | 700 | depends on badge type |
| Caption / Meta | Cairo | 11–12px | 400 | `#666666` |

### Typography Rules
- **Arabic text:** always `direction: rtl; text-align: right`
- **Line height Arabic:** `1.7–1.8` (Arabic script needs more breathing room)
- **Letter spacing brand name:** `1–2px` for display text
- **Numbers:** use Eastern Arabic numerals (٠١٢٣) in Arabic context, Western (0123) in admin/code contexts

---

## 4. Spacing System

```css
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 24px
--space-6: 32px
--space-7: 48px
--space-8: 64px
```

---

## 5. Border Radius

```css
--radius-sm: 4px    /* Badges, small chips */
--radius-md: 8px    /* Buttons, inputs */
--radius-lg: 12px   /* Cards, product tiles */
--radius-xl: 16px   /* Hero cards, modals */
--radius-pill: 9999px /* Tags, status pills */
```

---

## 6. Component Library

### Buttons

```tsx
/* Primary — Gold fill */
<button className="bg-[#C9A84C] text-[#0D0D0D] font-bold font-arabic
                   px-6 py-2.5 rounded-md hover:bg-[#E8D5A0]
                   transition-colors duration-200">
  اطلب الآن
</button>

/* Outline — Gold border */
<button className="bg-transparent border border-[#C9A84C] text-[#C9A84C]
                   font-bold font-arabic px-6 py-2.5 rounded-md
                   hover:bg-[#C9A84C]/10 transition-colors duration-200">
  شاهد المنيو
</button>

/* Ghost — for nav links */
<button className="bg-transparent text-[#B0B0B0] hover:text-[#C9A84C]
                   transition-colors duration-200">
  الرئيسية
</button>
```

### Badges / Pills

```tsx
/* New product */
<span className="bg-[#C9A84C] text-[#0D0D0D] text-[10px] font-bold
                 px-2 py-0.5 rounded-full">
  جديد
</span>

/* Made-to-order */
<span className="bg-transparent border border-[#C9A84C] text-[#C9A84C]
                 text-[10px] font-bold px-2 py-0.5 rounded-full">
  مخصوص
</span>

/* Available */
<span className="bg-[#1c2a1c] text-[#4CAF50] text-[10px] font-bold
                 px-2 py-0.5 rounded-full">
  متاح
</span>

/* Sold out */
<span className="bg-[#2a1a1a] text-[#E57373] text-[10px] font-bold
                 px-2 py-0.5 rounded-full">
  نفذ
</span>
```

### Product Card

```tsx
<div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]
               overflow-hidden hover:border-[#C9A84C44]
               transition-all duration-300 cursor-pointer">
  {/* Image */}
  <div className="aspect-square relative overflow-hidden">
    <Image src={product.image} alt={product.name} fill className="object-cover" />
    {product.isCustom && (
      <div className="absolute top-2 right-2">
        <Badge variant="custom">مخصوص</Badge>
      </div>
    )}
  </div>
  {/* Info */}
  <div className="p-4" dir="rtl">
    <h3 className="text-[#FAFAFA] font-semibold text-[15px]">{product.name}</h3>
    {product.prepTime && (
      <p className="text-[#666] text-[11px] mt-1">يتجهز في {product.prepTime}</p>
    )}
    <div className="flex items-center justify-between mt-3">
      <span className="text-[#C9A84C] font-bold text-lg">{product.price} جنيه</span>
      <button className="...">أضف للسلة</button>
    </div>
  </div>
</div>
```

### Divider / Ornament

```tsx
/* Gold gradient divider — signature Milano element */
<div className="w-full h-px bg-gradient-to-r from-transparent
               via-[#C9A84C] to-transparent opacity-40 my-4" />

/* Short centered ornament */
<div className="w-24 h-px bg-gradient-to-r from-transparent
               via-[#C9A84C] to-transparent mx-auto" />
```

### Input Fields

```tsx
<input
  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-md
             px-4 py-2.5 text-[#FAFAFA] text-sm
             placeholder:text-[#666]
             focus:outline-none focus:border-[#C9A84C]
             focus:ring-1 focus:ring-[#C9A84C]/30
             transition-colors duration-200"
  dir="rtl"
  placeholder="اسمك الكريم..."
/>
```

---

## 7. Order Status Colors

| Status | Background | Text | Arabic |
|--------|-----------|------|--------|
| `new` | `#1a1a2a` | `#7B8FE8` | جديد |
| `confirmed` | `#1a2a1a` | `#4CAF50` | تم التأكيد |
| `in_preparation` | `#2a1f0a` | `#FFA726` | قيد التحضير |
| `ready` | `#1a2820` | `#26A69A` | جاهز |
| `out_for_delivery` | `#0a1a2a` | `#42A5F5` | في الطريق |
| `delivered` | `#1a2a1a` | `#66BB6A` | تم التوصيل |
| `picked_up` | `#1a2a1a` | `#66BB6A` | تم الاستلام |
| `cancelled` | `#2a1a1a` | `#EF5350` | ملغي |

---

## 8. Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D5A0',
          dark: '#8A6F28',
        },
        dark: {
          base: '#0D0D0D',
          surface: '#1A1A1A',
          card: '#242424',
          elevated: '#2E2E2E',
          border: '#2A2A2A',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      borderRadius: {
        'pill': '9999px',
      },
    },
  },
}
```

---

## 9. Globals CSS

```css
/* app/globals.css */

:root {
  --color-gold: #C9A84C;
  --color-gold-light: #E8D5A0;
  --color-gold-dark: #8A6F28;
  --color-bg-base: #0D0D0D;
  --color-bg-surface: #1A1A1A;
  --color-bg-card: #242424;
  --color-bg-elevated: #2E2E2E;
  --color-text-primary: #FAFAFA;
  --color-text-accent: #C9A84C;
  --color-text-muted: #B0B0B0;
  --color-text-disabled: #666666;
  --color-border-default: #2A2A2A;
  --color-border-gold: #C9A84C44;
  --font-display: 'Playfair Display', serif;
  --font-arabic: 'Cairo', sans-serif;
}

html {
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  font-family: var(--font-arabic);
}

/* Arabic text defaults */
[dir="rtl"] {
  font-family: var(--font-arabic);
  line-height: 1.75;
}

/* Gold divider utility */
.divider-gold {
  height: 1px;
  background: linear-gradient(90deg, transparent, #C9A84C44, transparent);
}

/* Scrollbar styling */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-bg-surface); }
::-webkit-scrollbar-thumb { background: var(--color-border-default); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-gold-dark); }
```



*End of Document — Version 1.0*