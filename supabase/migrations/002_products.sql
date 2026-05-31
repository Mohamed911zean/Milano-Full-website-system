-- ============================================================
-- 002 — Products & Variants
-- ============================================================

CREATE TABLE products (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id           uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name_ar               text NOT NULL,
  name_en               text,
  description_ar        text,
  base_price            numeric(10,2) NOT NULL CHECK (base_price >= 0),
  pricing_unit          pricing_unit NOT NULL DEFAULT 'per_item',
  images                text[] NOT NULL DEFAULT '{}',
  preparation_type      preparation_type NOT NULL DEFAULT 'ready_made',
  prep_duration_minutes integer CHECK (prep_duration_minutes > 0),  -- null = ready_made
  allows_text_on_cake   boolean NOT NULL DEFAULT false,  -- "اكتب على التورتة"
  is_active             boolean NOT NULL DEFAULT true,
  is_featured           boolean NOT NULL DEFAULT false,
  sort_order            integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  -- لو made_to_order لازم يكون عنده prep_duration
  CONSTRAINT chk_prep_duration CHECK (
    preparation_type = 'ready_made' OR prep_duration_minutes IS NOT NULL
  )
);

-- ============================================================
-- Product Variants: الأحجام والنكهات والأوزان
-- ============================================================

CREATE TABLE product_variants (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id     uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name_ar        text NOT NULL,          -- "كيلو", "نصف كيلو", "26 سم", "18 سم"
  price          numeric(10,2) NOT NULL CHECK (price >= 0), -- السعر الكامل مش modifier
  is_default     boolean NOT NULL DEFAULT false,
  sort_order     integer NOT NULL DEFAULT 0,
  is_active      boolean NOT NULL DEFAULT true
);

-- كل product لازم يكون عنده variant default واحد بس
CREATE UNIQUE INDEX uq_default_variant
  ON product_variants(product_id)
  WHERE is_default = true;

-- ============================================================
-- Auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS — Products
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Public: يقدر يقرأ المنتجات النشطة بس
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = true);

-- Authenticated: full access
CREATE POLICY "products_auth_all" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Variants: نفس الـ products
CREATE POLICY "variants_public_read" ON product_variants
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_id AND p.is_active = true
    )
  );

CREATE POLICY "variants_auth_all" ON product_variants
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_products_category ON products(category_id) WHERE is_active = true;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_variants_product ON product_variants(product_id);
