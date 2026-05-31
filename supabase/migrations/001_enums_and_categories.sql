-- ============================================================
-- 001 — Enums & Categories
-- ============================================================

-- Preparation type: هل المنتج جاهز أو بيتعمل على الطلب؟
CREATE TYPE preparation_type AS ENUM (
  'ready_made',     -- جاهز، ممكن يتاخد من الفرع
  'made_to_order'   -- بيتعمل خصيصاً بعد الطلب
);

-- Pricing unit: إزاي المنتج بيتباع؟
CREATE TYPE pricing_unit AS ENUM (
  'per_item',    -- قطعة (تورتة، بروفيترول)
  'per_dozen',   -- دستة (جاتوه)
  'per_kg',      -- كيلو (شرقي، شوكليت)
  'per_box'      -- علبة (مشكل)
);

-- Fulfillment: توصيل ولا استلام؟
CREATE TYPE fulfillment_type AS ENUM (
  'delivery',
  'pickup'
);

-- Order status flow
CREATE TYPE order_status AS ENUM (
  'new',
  'confirmed',
  'in_preparation',
  'ready',
  'out_for_delivery',
  'delivered',
  'picked_up',
  'cancelled'
);

-- Staff role
CREATE TYPE staff_role AS ENUM (
  'owner',
  'operations'
);

-- ============================================================
-- Categories
-- ============================================================

CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar     text NOT NULL,
  name_en     text,
  image_url   text,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- الكل يقدر يقرأ الـ categories النشطة
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (is_active = true);

-- بس الـ authenticated users (owner/staff) يقدروا يعدلوا
CREATE POLICY "categories_auth_all" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed: Milano categories
-- ============================================================

INSERT INTO categories (name_ar, name_en, sort_order) VALUES
  ('تورت',         'Cakes',          1),
  ('جاتوه',        'Gateau',         2),
  ('حلويات شرقية', 'Oriental Sweets', 3),
  ('مخبوزات',      'Bakery',         4),
  ('كافيهات',      'Cafeteria',      5),
  ('شوكليت',       'Chocolate',      6),
  ('منيو العيد',   'Eid Menu',       7),
  ('منيو المناسبات','Occasions Menu', 8);
