# Phase 2 — Customer Website
## Prompt for AI Coding Assistant

---

## CONTEXT

You are building the customer-facing website for **Milano Sweets**, a confectionery shop in Mansoura, Egypt.

Before writing any code, read these files carefully:
- `Milano_PRD.md` — full product requirements
- `Milano_Design_System.md` — colors, fonts, components, CSS variables

The backend foundation (database, service layer, types) is already built in Phase 1 and lives in:
- `lib/supabase/` — Supabase clients (server + client)
- `lib/services/products.ts` — all product queries
- `lib/services/orders.ts` — order creation and tracking
- `lib/schemas/order.ts` — Zod validation schemas
- `lib/supabase/types.ts` — all TypeScript types

**Do not modify any file in `lib/`. Only build UI and pages.**

---

## TECH STACK

- Next.js 16 App Router — TypeScript strict mode
- Tailwind CSS — use CSS variables from Design System
- shadcn/ui — for accessible base components (Dialog, Select, Input, etc.)
- Zustand — for cart state (client-side only)
- Zod — already set up in `lib/schemas/order.ts`
- `next/image` — for ALL images, no `<img>` tags
- Arabic RTL — `dir="rtl"` on root layout, font: Cairo

---

## FOLDER STRUCTURE TO CREATE

```
app/
├── (customer)/
│   ├── layout.tsx              ← RTL layout, navbar, footer, WhatsApp button
│   ├── page.tsx                ← Homepage
│   ├── products/
│   │   └── page.tsx            ← Catalog with category filter
│   ├── products/[id]/
│   │   └── page.tsx            ← Product detail
│   ├── cart/
│   │   └── page.tsx            ← Cart review
│   ├── checkout/
│   │   └── page.tsx            ← Checkout form
│   ├── order-confirmed/
│   │   └── page.tsx            ← Success screen
│   └── track-order/
│       └── page.tsx            ← Order tracking
components/
└── customer/
    ├── Navbar.tsx
    ├── Footer.tsx
    ├── WhatsAppButton.tsx
    ├── ProductCard.tsx
    ├── ProductGrid.tsx
    ├── CategoryFilter.tsx
    ├── CartDrawer.tsx          ← slide-in cart sidebar
    ├── CheckoutForm.tsx
    ├── LocationPicker.tsx      ← Google Maps pin OR manual address
    ├── OrderStatusBadge.tsx
    └── OrderTimeline.tsx
lib/
└── store/
    └── cart.ts                 ← Zustand cart store
```

---

## DESIGN RULES — READ CAREFULLY

Apply the full design system from `Milano_Design_System.md`. Key rules:

```css
/* Always use these CSS variables — never hardcode colors */
--color-gold: #C9A84C
--color-gold-light: #E8D5A0
--color-bg-base: #0D0D0D
--color-bg-surface: #1A1A1A
--color-bg-card: #242424
--color-text-primary: #FAFAFA
--color-text-muted: #B0B0B0
--color-border-default: #2A2A2A
```

```tsx
// Fonts
// Display/brand text → font-family: 'Playfair Display', serif
// ALL Arabic text → font-family: 'Cairo', sans-serif

// Gold gradient divider — use between sections
<div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C44] to-transparent" />
```

**Dark theme only.** No light mode. Background is always `#0D0D0D`.

---

## FILE 1: `lib/store/cart.ts`

Build a Zustand store with:

```typescript
interface CartStore {
  items: CartItem[]           // CartItem type from lib/supabase/types.ts
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number          // computed
  totalPrice: number          // computed
}
```

Rules:
- `addItem`: if same productId + variantId already exists → increment quantity
- No localStorage — memory only
- Export a `useCart` hook

---

## FILE 2: `app/(customer)/layout.tsx`

```tsx
// Requirements:
// - dir="rtl" on html or root div
// - Import Cairo + Playfair Display from next/font/google
// - Apply --color-bg-base as background
// - Include <Navbar /> at top
// - Include <Footer /> at bottom
// - Include <WhatsAppButton /> (floating, always visible)
// - Children in between
```

---

## FILE 3: `components/customer/Navbar.tsx`

```
Logo (right side, RTL) | nav links | Cart icon with item count badge
```

Requirements:
- Logo: "Milano" in Playfair Display, gold color
- Nav links: الرئيسية / المنتجات / تتبع طلبك
- Cart icon: shows item count badge from Zustand store
- Clicking cart icon opens `<CartDrawer />`
- Sticky on scroll
- Mobile: hamburger menu

---

## FILE 4: `app/(customer)/page.tsx` — Homepage

Sections in order:

**1. Hero**
- Full-width, dark background
- Milano logo large (Playfair Display, gold)
- Tagline in Arabic: "حلويات راقية من قلب المنصورة"
- Two CTAs: "اطلب الآن" (primary gold) → `/products` | "شاهد المنيو" (outline) → `/products`
- Gold ornament divider below

**2. Categories Grid**
- Call `getActiveCategories()` from `lib/services/products.ts` — Server Component
- Display as grid (2 cols mobile, 4 cols desktop)
- Each card: category image + name_ar
- Click → `/products?category=id`

**3. Featured Products**
- Call `getFeaturedProducts()` from `lib/services/products.ts` — Server Component
- Display as `<ProductGrid />` (see below)
- Section title: "الأكثر طلباً"

**4. How to Order** (static)
- 3 steps: اختار منتجاتك / أكمل بياناتك / انتظر التوصيل
- Icons + Arabic text

**5. WhatsApp CTA**
- "تواصل معنا مباشرة على واتساب"
- Green WhatsApp button → `https://wa.me/${WHATSAPP_NUMBER}`
- Get WHATSAPP_NUMBER from `getShopConfig()` → `shop_config` table

---

## FILE 5: `components/customer/ProductCard.tsx`

```tsx
interface ProductCardProps {
  product: ProductWithVariants
}
```

Card layout (dark, RTL):
- Image: `next/image`, aspect-square, object-cover, rounded top
- Badges (top-right of image):
  - `made_to_order` → gold outline badge: "يتجهز خصيصاً"
  - `is_featured` → gold fill badge: "الأكثر طلباً"
- Product name_ar: white, semibold
- Prep time (if made_to_order): "يتجهز في X دقيقة", muted text
- Price: show default variant price in gold
- "أضف للسلة" button → opens product detail or adds directly if single variant
- Hover: slight border-gold glow

---

## FILE 6: `app/(customer)/products/page.tsx` — Catalog

```tsx
// searchParams: { category?: string }
```

Requirements:
- Server Component
- Fetch categories + products based on selected category
- If no category selected → show all products or first category
- `<CategoryFilter />` — horizontal scroll tabs (mobile friendly)
- `<ProductGrid />` — responsive grid (2 cols mobile, 3-4 desktop)
- Active category tab highlighted in gold

---

## FILE 7: `app/(customer)/products/[id]/page.tsx` — Product Detail

Fetch product by id using `getProductBySlug(id)` from services.

Layout:
- Product image (large, top on mobile)
- Name, description, category badge
- **Variant selector**: if product has multiple variants → show as button group (e.g. "26 سم" / "18 سم" / "كيلو" / "نصف كيلو"). Selected variant highlighted gold.
- Price: updates based on selected variant
- **If `allows_text_on_cake = true`**: show text input "اكتب على التورتة (اختياري)"
- Prep time note if `made_to_order`
- Quantity selector (+/-)
- "أضف للسلة" button → adds to Zustand cart → shows success toast
- Back button

---

## FILE 8: `components/customer/CartDrawer.tsx`

Slide-in from right (RTL), dark background.

Contents:
- List of cart items: image, name, variant, price, quantity controls, remove button
- Subtotal
- Delivery fee note: "رسوم التوصيل تُحسب عند الطلب"
- "إتمام الطلب" button → navigate to `/checkout`
- "مسح السلة" button
- Empty state: illustration + "سلتك فاضية"

---

## FILE 9: `app/(customer)/checkout/page.tsx`

**Client Component** (`"use client"`).

Form fields (RTL, dark inputs):
```
الاسم الكريم *
رقم التليفون *          (Egyptian format: 01xxxxxxxxx)

طريقة الاستلام:
  ○ توصيل للباب
  ○ استلام من الفرع

--- if delivery selected ---
العنوان بالتفصيل *      (text input)
أو
[📍 حدد موقعك على الخريطة]   (optional Google Maps button)
                              → opens LocationPicker component
ملاحظة على الموقع       (optional)

ملاحظات إضافية         (optional textarea)
```

Order summary on the right (desktop) / below (mobile):
- List of items
- Subtotal + delivery fee + total

Submit button: "تأكيد الطلب"

On submit:
1. Validate with `CreateOrderSchema` from `lib/schemas/order.ts`
2. Call `createOrder()` Server Action (wrap `orders.ts` createOrder)
3. Clear cart
4. Redirect to `/order-confirmed?number=MIL-XXXX`

**Validation errors**: show in Arabic below each field.

---

## FILE 10: `components/customer/LocationPicker.tsx`

```tsx
interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
}
```

Requirements:
- Uses Google Maps JavaScript API
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` from env
- Shows map centered on Mansoura (30.0444° N, 31.2357° E)
- User drops pin anywhere
- Reverse geocode the pin to get address string
- "تأكيد الموقع" button → calls onLocationSelect
- **Fallback**: if Maps fails to load or user closes → silently fall back (manual address input takes over)
- Map only loads when user clicks "حدد موقعك على الخريطة" (lazy load)

---

## FILE 11: `app/(customer)/order-confirmed/page.tsx`

```tsx
// searchParams: { number: string }
```

Show:
- ✓ green checkmark animation
- "تم استلام طلبك بنجاح!"
- Order number: MIL-XXXX (large, gold)
- "سيتواصل معك فريقنا على الواتساب لتأكيد موعد التوصيل"
- WhatsApp button to contact shop directly
- "تتبع طلبك" link → `/track-order`
- "العودة للرئيسية" link

---

## FILE 12: `app/(customer)/track-order/page.tsx`

Form:
- رقم الطلب (e.g. MIL-0042)
- رقم التليفون

On submit → call `getOrderByNumberAndPhone()` from orders service.

Show result:
- Order status timeline using `<OrderTimeline />`
- List of ordered items
- Estimated notes

`<OrderTimeline />`: vertical timeline showing all statuses, current one highlighted gold, future ones muted.

---

## FILE 13: `components/customer/WhatsAppButton.tsx`

```tsx
// Floating button, fixed bottom-left (RTL: bottom-left = visual bottom-right)
// Green color: #25D366
// WhatsApp icon
// Slight pulse animation
// href → wa.me link from shop config
// Opens in new tab
```

---

## FILE 14: `components/customer/Footer.tsx`

Dark background, gold accents:
- Milano logo
- Shop address (from config)
- Phone number
- Navigation links
- "جميع الحقوق محفوظة © Milano Sweets 2025"

---

## GENERAL RULES FOR ALL FILES

1. **Every async data fetch → Server Component** unless interactivity is needed
2. **"use client" only when** using hooks, event handlers, or browser APIs
3. **All text facing customers → Arabic** (name_ar fields, not name_en)
4. **Loading states**: use Next.js `loading.tsx` files or Suspense with skeleton UI
5. **Error states**: every page has an error boundary (`error.tsx`)
6. **No hardcoded colors** — always use CSS variables or Tailwind classes from Design System
7. **No `<img>` tags** — always `next/image`
8. **Phone validation**: Egyptian numbers only — regex `^01[0-9]{9}$`
9. **Prices**: always show in Arabic with "جنيه" suffix, e.g. "٣٦٥ جنيه"
10. **Import paths**: use `@/` alias for all imports

---

## SERVER ACTIONS NEEDED

Create `app/actions/orders.ts`:

```typescript
"use server"
import { createOrder } from '@/lib/services/orders'
import { CreateOrderSchema } from '@/lib/schemas/order'

export async function submitOrder(formData: CreateOrderInput) {
  // 1. Validate with Zod
  const parsed = CreateOrderSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() }
  }
  // 2. Create order
  const order = await createOrder(parsed.data)
  return { success: true, orderNumber: order.order_number }
}
```

---

## WHAT NOT TO BUILD IN THIS PHASE

- ❌ Dashboard / admin pages
- ❌ Login / auth pages
- ❌ Payment system
- ❌ Loyalty points
- ❌ Multi-branch

---

## OUTPUT EXPECTED

Working Next.js pages where a customer can:
1. Browse products by category
2. View product detail and select variant
3. Add to cart
4. Fill checkout form (with optional map pin)
5. Submit order
6. See confirmation screen
7. Track order by phone + order number