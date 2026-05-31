# Product Requirements Document
## Milano Confectionery — Website & Order Management System
**Version:** 1.0  
**Date:** May 2026  
**Prepared by:** Development Team  
**Client (Pilot):** Milano Confectionery — Mansoura, Egypt  

---

## 1. Project Overview

### 1.1 Vision
A production-grade, white-label confectionery platform that serves as a complete digital storefront and internal order management system. The system is built once with a clean, modular architecture, then deployed per client with full branding and configuration customization.

### 1.2 Business Context
Milano is a confectionery shop in Mansoura operating as a **physical point of sale**. This platform transforms their shop into a **digital sales channel**, enabling customers to:
- Browse and order online for delivery or in-store pickup
- Request custom-made cakes with specific requirements
- Order ready-made items to be freshly prepared (not pre-packaged)

The broader vision is to resell this system to other confectionery shops and businesses across Egypt after the pilot.

### 1.3 Core Differentiator
Unlike generic e-commerce platforms, this system is purpose-built for the **Egyptian confectionery business model**, specifically:
- No online payment (cash on delivery / in-store) — common in Egyptian market
- Custom cake ordering with image upload and personalization
- "Made-to-order" vs "Ready-made" distinction per product
- Arabic-first UI with RTL support
- Operations team dashboard for order processing and customer communication

---

## 2. Stakeholders & Roles

| Role | Arabic Label | Description |
|------|-------------|-------------|
| **Owner** | صاحب المحل | Full access. Creates accounts for all staff. Can remove any account. Views all analytics. |
| **Operations Staff** | موظف العمليات | Receives orders, updates order status, communicates with customers. No access to business settings or analytics. |
| **Customer** | الزبون | Public-facing website user. No login required to place an order. |

> **Note:** The Owner manages the system from their dashboard and grants/revokes access for Operations Staff. There is no self-registration for staff — only owner-created accounts.

---

## 3. System Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  CUSTOMER WEBSITE                    │
│          (Public-facing Next.js frontend)            │
│  • Product catalog    • Custom order flow            │
│  • Cart & checkout    • Order tracking               │
└──────────────────────────┬──────────────────────────┘
                           │ Orders flow in
                           ▼
┌─────────────────────────────────────────────────────┐
│              ADMIN DASHBOARD                         │
│         (Internal Next.js application)               │
│                                                      │
│  Owner View              Operations View             │
│  • Full analytics        • Order queue               │
│  • Staff management      • Order status updates      │
│  • Product management    • Customer comms            │
│  • Branding settings     • Notes per order           │
│  • Delivery config                                   │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                   │
│  • PostgreSQL DB     • Auth (Owner & Staff only)     │
│  • Storage (images)  • Realtime (order notifications)│
│  • Row Level Security per role                       │
└─────────────────────────────────────────────────────┘
```

### 3.1 Deployment Model
- **Per-client deployment**: Each client (confectionery shop) gets their own separate deployment with their own Supabase project (separate database).
- **Codebase**: Single codebase with environment-based configuration.
- **Per-client config**: `env` variables control branding colors, shop name, logo, delivery zones, and feature flags.
- **Domain**: Each client has their own domain or subdomain.

---

## 4. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js 16 = latest version (App Router) | SSR for SEO, fast performance |
| Styling | Tailwind CSS + UI library (shadcn/ui) | Rapid development, accessible components |
| Backend | Supabase | Auth, DB, Storage, Realtime in one |
| Database | PostgreSQL (via Supabase) | Relational, row-level security |
| Auth | Supabase Auth | Owner + Staff login only |
| File Storage | Supabase Storage | Product images, custom cake uploads |
| Realtime | Supabase Realtime | Live order notifications in dashboard |
| Deployment | Vercel (or equivalent) | Per-client deployment, env variables |
| Language | TypeScript | Type safety for maintainability |

---

## 5. Database Schema

### 5.1 Tables

#### `products`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| name_ar | text | Arabic product name |
| name_en | text | English product name (optional) |
| description_ar | text | |
| category_id | uuid FK | |
| base_price | numeric | Base price in EGP |
| images | text[] | Array of Supabase storage URLs |
| is_active | boolean | Show/hide on website |
| allows_customization | boolean | Can customer send custom request? |
| preparation_type | enum | `ready_made` / `made_to_order` |
| prep_duration_minutes | integer | e.g. 90 for made-to-order |
| sort_order | integer | Display order in category |
| created_at | timestamptz | |

#### `product_variants`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| product_id | uuid FK | |
| name_ar | text | e.g. "كيلو", "نصف كيلو" |
| price_modifier | numeric | Added to base_price |
| is_default | boolean | |

#### `categories`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| name_ar | text | |
| name_en | text | |
| image_url | text | |
| sort_order | integer | |
| is_active | boolean | |

#### `orders`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| order_number | text | Human-readable, e.g. MIL-0042 |
| customer_name | text | |
| customer_phone | text | |
| customer_address | text | null if pickup |
| fulfillment_type | enum | `delivery` / `pickup` |
| status | enum | See Order Status Flow |
| notes | text | Customer notes |
| total_price | numeric | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| assigned_to | uuid FK | Staff member handling this order |
| staff_notes | text | Internal notes by operations team |

#### `order_items`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| order_id | uuid FK | |
| product_id | uuid FK | |
| variant_id | uuid FK | nullable |
| quantity | integer | |
| unit_price | numeric | Captured at order time |
| item_type | enum | `standard` / `custom_request` |
| custom_description | text | For custom cake orders |
| custom_image_url | text | Uploaded reference image |
| preparation_note | text | e.g. "اكتب عليها: عيد ميلاد سارة" |

#### `shop_config`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| key | text unique | Config key |
| value | jsonb | Config value |

> Examples: `delivery_zones`, `business_hours`, `contact_phone`, `whatsapp_number`, `min_order_amount`

#### `staff_accounts`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | = Supabase Auth user id |
| full_name | text | |
| role | enum | `owner` / `operations` |
| is_active | boolean | Owner can deactivate without deletion |
| created_by | uuid FK | Owner's user id |
| created_at | timestamptz | |

---

## 6. Order Status Flow

```
NEW → CONFIRMED → IN_PREPARATION → READY → OUT_FOR_DELIVERY → DELIVERED
                                         ↘
                                           PICKED_UP
                         ↘
                           CANCELLED
```

| Status | Arabic Label | Who Sets It |
|--------|-------------|-------------|
| `new` | جديد | System (auto on submit) |
| `confirmed` | تم التأكيد | Operations Staff |
| `in_preparation` | قيد التحضير | Operations Staff |
| `ready` | جاهز | Operations Staff |
| `out_for_delivery` | في الطريق | Operations Staff |
| `delivered` | تم التوصيل | Operations Staff |
| `picked_up` | تم الاستلام | Operations Staff |
| `cancelled` | ملغي | Owner or Staff |

---

## 7. Customer Website — Features

### 7.1 Pages & Flows

#### Homepage
- Hero section with shop branding
- Featured categories grid
- Featured/promoted products
- How to order section (3 steps)
- Contact info + WhatsApp button

#### Product Catalog (`/products` or `/`)
- Filter by category
- Product cards showing: image, name, price, preparation type badge
- "مخصوص" badge on made-to-order items
- Search bar

#### Product Detail Page (`/products/[slug]`)
- Image gallery
- Name, description, price
- Variant selector (size/weight)
- **Preparation type section:**
  - If `made_to_order`: shows estimated prep time ("يتجهز في ساعة ونص")
  - Writing on product input field (e.g. "اكتب على التورتة")
  - Option to upload reference image
  - Option to write custom description
- Add to cart button

#### Cart & Checkout
- Cart summary
- Customer info form:
  - Name (required)
  - Phone number (required)
  - Fulfillment: Delivery or Pickup
  - If delivery: address + zone selector
  - Special notes
- Order review step
- Confirmation screen with order number
- **No online payment** — message: "هيتواصل معاك حد من فريقنا لتأكيد الأوردر"

#### Order Tracking (`/track-order`)
- Customer enters phone + order number
- Sees current status with progress bar

### 7.2 UI/UX Requirements
- **Arabic first** (RTL layout)
- Fully mobile-responsive
- WhatsApp floating button (always visible)
- Loading states on all async actions
- Error handling with friendly Arabic messages
- Optimistic UI on cart actions

---

## 8. Admin Dashboard — Features

### 8.1 Owner Dashboard

#### Overview / Home
- Today's orders count
- Today's revenue (estimated, since cash-based)
- Orders by status (visual breakdown)
- Pending orders requiring attention
- Recent activity feed
- Quick actions: Add product, View orders

#### Orders Management
- Full orders table with filters:
  - By status
  - By date range
  - By fulfillment type (delivery/pickup)
  - By staff member
- Order detail view:
  - Full customer info
  - All ordered items with customizations
  - Attached images (custom cake requests)
  - Status timeline
  - Assign to staff member
  - Internal staff notes
  - Change status
- Export orders (CSV)

#### Products Management
- Products table with quick toggle (active/inactive)
- Add/edit/delete product:
  - Rich text description (Arabic)
  - Multiple image upload (drag & drop)
  - Category assignment
  - Pricing + variants
  - Preparation type toggle
  - Prep duration input
  - Customization allowed toggle
  - Sort order drag & drop
- Category management (add/edit/delete/reorder)

#### Analytics (Owner Only)
- Orders over time (line chart)
- Revenue over time
- Top-selling products
- Orders by fulfillment type (pie chart)
- Peak hours heatmap
- Staff performance (orders handled per staff)

#### Staff Management (Owner Only)
- List of all staff accounts
- Create new account (name, temporary password, role)
- Activate / deactivate accounts
- Reset password for staff

#### Shop Settings (Owner Only)
- Delivery zones management (add zones with fees)
- Business hours
- Contact phone & WhatsApp number
- Minimum order amount
- Shop announcement banner (shows on website)

#### Branding Settings (Owner Only)
- Primary color picker
- Logo upload
- Shop name
- Hero banner image

### 8.2 Operations Staff Dashboard

#### Order Queue
- Live-updating list of all active orders
- Sound/visual notification on new order
- Quick status update buttons on each order card
- Filter by: new, confirmed, in preparation, ready
- Click to open order detail

#### Order Detail (Staff View)
- All customer information
- All items with customization details
- Custom cake images (viewable full-screen)
- Status change buttons
- Add internal note
- WhatsApp quick-link (opens WhatsApp with customer number pre-filled)

> Staff cannot see: analytics, other staff accounts, shop settings, or product management.

---

## 9. Notifications & Realtime

### 9.1 New Order Notification
- Dashboard plays sound alert on new order (browser notification API)
- Order appears in real-time in the queue without page refresh (Supabase Realtime)
- No external push notification service needed in v1

### 9.2 Customer Communication
- Staff uses WhatsApp (manual) to contact customer for order confirmation
- System provides quick-link: `https://wa.me/20XXXXXXXXX?text=...` pre-filled with order number and customer name
- No automated SMS/WhatsApp in v1

---

## 10. Custom Cake Order Flow (Detailed)

```
Customer opens product page (e.g. "تورتة")
            ↓
Sees two options:
┌─────────────────────┐    ┌─────────────────────────┐
│  اطلب من المنيو      │    │    تصميم خاص             │
│  (Choose from menu) │    │    (Custom design)       │
│                     │    │                          │
│  → Pick variant     │    │  → Upload reference img  │
│  → Add text         │    │  → Describe requirements │
│  → "تتجهز في ساعة" │    │  → Estimated prep time   │
└─────────────────────┘    └─────────────────────────┘
            ↓                           ↓
                    Add to cart
                        ↓
                   Checkout flow
                        ↓
            Order submitted → Staff notified
                        ↓
          Staff contacts customer on WhatsApp
          to confirm details & delivery time
```

---

## 11. Customization Per Client (Future Deployments)

When deploying for a new client, the following is configurable via environment variables and database seed:

| Customizable | Method |
|-------------|--------|
| Shop name & logo | env + Supabase config table |
| Brand colors (primary, accent) | env → CSS variables |
| Products & categories | Supabase DB (fresh seed per client) |
| Prices | Supabase DB |
| Delivery zones & fees | Supabase config table |
| Business hours | Supabase config table |
| Contact info | Supabase config table |
| Domain | Vercel deployment |

**Not customizable (same for all clients):**
- Core system features and logic
- UI layout and component structure
- Role system and permissions

---

## 12. Non-Functional Requirements

### 12.1 Performance
- Lighthouse score ≥ 90 on mobile for customer website
- Product images served via CDN with lazy loading
- Next.js Image optimization enabled
- Static generation for product catalog pages where possible

### 12.2 Code Quality (Critical for Resale)
- TypeScript strict mode enabled
- ESLint + Prettier enforced
- Consistent folder structure (feature-based, not type-based)
- All database queries go through typed service layer (no raw SQL in components)
- Supabase RLS (Row Level Security) policies on all tables
- Environment-based configuration — zero hardcoded values
- Comprehensive README for per-client deployment

### 12.3 Security
- Supabase RLS: Operations Staff cannot access owner-only data
- No sensitive data exposed in client-side code
- Input sanitization on all form fields
- Rate limiting on order submission endpoint
- Image upload validation (type + size limits)

### 12.4 Accessibility
- Arabic RTL layout correct throughout
- All images have alt text
- Form fields have proper labels
- Color contrast meets WCAG AA

---

## 13. Project Structure (Recommended)

```
/
├── app/
│   ├── (customer)/          # Public website
│   │   ├── page.tsx         # Homepage
│   │   ├── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── track-order/
│   └── (dashboard)/         # Admin — auth protected
│       ├── layout.tsx       # Auth check + role detection
│       ├── orders/
│       ├── products/
│       ├── analytics/       # Owner only
│       ├── staff/           # Owner only
│       └── settings/        # Owner only
├── components/
│   ├── customer/            # Website-specific components
│   ├── dashboard/           # Dashboard-specific components
│   └── shared/              # Shared across both
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts         # Generated from DB schema
│   ├── services/            # Business logic layer
│   │   ├── orders.ts
│   │   ├── products.ts
│   │   └── auth.ts
│   └── config.ts            # Env-based shop config
├── types/                   # Shared TypeScript types
└── supabase/
    ├── migrations/          # DB migrations
    └── seed.ts              # Per-client seed script
```

---

## 14. Out of Scope (v1)

| Feature | Notes |
|---------|-------|
| Online payment | Future phase — Paymob or Fawry integration |
| Inventory management | Client has separate system |
| Multi-branch | Architecture supports it, UI deferred |
| Loyalty points | Deferred |
| Mobile app | Web-first, PWA possible later |
| Automated WhatsApp/SMS | Manual communication in v1 |

---

## 15. Milestones

| Phase | Deliverable | Scope |
|-------|-------------|-------|
| **Phase 1** | Foundation | DB schema, Supabase setup, auth system, project structure |
| **Phase 2** | Customer Website | Full product catalog, cart, checkout, order submission |
| **Phase 3** | Operations Dashboard | Order queue, realtime notifications, status management |
| **Phase 4** | Owner Dashboard | Products management, staff management, settings |
| **Phase 5** | Analytics & Polish | Analytics views, performance optimization, RTL QA |
| **Phase 6** | Deployment & Handoff | Milano go-live, deployment documentation for future clients |

---

*End of Document — Version 1.0*