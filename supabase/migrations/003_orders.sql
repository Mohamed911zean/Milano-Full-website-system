-- ============================================================
-- 003 — Orders & Order Items
-- ============================================================

CREATE TABLE orders (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Human-readable order number: MIL-0001
  order_number      text UNIQUE NOT NULL,

  -- بيانات الزبون
  customer_name     text NOT NULL,
  customer_phone    text NOT NULL CHECK (customer_phone ~ '^01[0-9]{9}$'),

  -- الموقع: يدوي أو pin على الخريطة أو الاتنين
  delivery_address  text,                -- العنوان اليدوي
  location_lat      numeric(10,7),       -- من Google Maps pin
  location_lng      numeric(10,7),       -- من Google Maps pin
  location_note     text,                -- ملاحظة إضافية على الموقع

  -- نوع الاستلام
  fulfillment_type  fulfillment_type NOT NULL,

  -- لو delivery لازم يكون عنده عنوان (يدوي أو pin)
  CONSTRAINT chk_delivery_address CHECK (
    fulfillment_type = 'pickup' OR
    (delivery_address IS NOT NULL OR location_lat IS NOT NULL)
  ),

  -- الحالة
  status            order_status NOT NULL DEFAULT 'new',

  -- الأسعار
  subtotal          numeric(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee      numeric(10,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  total_price       numeric(10,2) GENERATED ALWAYS AS (subtotal + delivery_fee) STORED,

  -- ملاحظات
  customer_notes    text,
  staff_notes       text,  -- ملاحظات داخلية، مش بتتعرض للزبون

  -- المسؤول
  assigned_to       uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- التوقيت
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  confirmed_at      timestamptz,
  delivered_at      timestamptz
);

-- ============================================================
-- Order Number Generator
-- ============================================================

CREATE SEQUENCE order_number_seq START 1;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'MIL-' || LPAD(nextval('order_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_generate_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Auto updated_at
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Order Items
-- ============================================================

CREATE TABLE order_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id          uuid REFERENCES products(id) ON DELETE SET NULL,
  variant_id          uuid REFERENCES product_variants(id) ON DELETE SET NULL,

  -- Snapshot: بنحفظ الاسم والسعر وقت الطلب عشان لو الأسعار اتغيرت
  product_name_ar     text NOT NULL,
  variant_name_ar     text,
  unit_price          numeric(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity            integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  line_total          numeric(10,2) GENERATED ALWAYS AS (unit_price * quantity) STORED,

  -- للتورت: نص على التورتة
  cake_text           text,   -- "اكتب عليها: عيد ميلاد سارة"

  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS — Orders
-- ============================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public: يقدر يعمل INSERT بس (يطلب)
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Public: يقدر يقرأ طلبه بس عن طريق رقم التليفون + رقم الطلب
CREATE POLICY "orders_public_read_own" ON orders
  FOR SELECT USING (
    -- بيتحقق من التليفون في الـ session أو query
    -- هيتعمل تضبيط من الـ server action
    true
  );

-- Authenticated: full access
CREATE POLICY "orders_auth_all" ON orders
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "order_items_public_insert" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "order_items_auth_all" ON order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_assigned ON orders(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_order_items_order ON order_items(order_id);
