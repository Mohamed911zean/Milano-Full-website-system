-- ============================================================
-- 004 — Staff Profiles & Shop Config
-- ============================================================

-- Staff profiles: مربوطة بـ auth.users
CREATE TABLE staff_profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text NOT NULL,
  role          staff_role NOT NULL DEFAULT 'operations',
  is_active     boolean NOT NULL DEFAULT true,
  created_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

-- كل authenticated user يقدر يقرأ الـ profiles
CREATE POLICY "profiles_auth_read" ON staff_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- بس الـ owner يقدر يعمل insert/update/delete
-- هنضيف function بتتأكد من الـ role
CREATE OR REPLACE FUNCTION is_owner()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_profiles
    WHERE id = auth.uid() AND role = 'owner'
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "profiles_owner_write" ON staff_profiles
  FOR ALL USING (is_owner());

-- ============================================================
-- Shop Config: key-value store للإعدادات
-- ============================================================

CREATE TABLE shop_config (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TRIGGER shop_config_updated_at
  BEFORE UPDATE ON shop_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE shop_config ENABLE ROW LEVEL SECURITY;

-- Public يقدر يقرأ config (عشان الموقع يحتاج delivery_fee مثلاً)
CREATE POLICY "config_public_read" ON shop_config
  FOR SELECT USING (true);

-- بس الـ owner يعدل
CREATE POLICY "config_owner_write" ON shop_config
  FOR ALL USING (is_owner());

-- ============================================================
-- Seed: Default shop config for Milano
-- ============================================================

INSERT INTO shop_config (key, value) VALUES
  ('shop_name',         '"Milano Sweets"'),
  ('shop_phone',        '"01000803760"'),
  ('whatsapp_number',   '"01000803760"'),
  ('delivery_fee',      '25'),
  ('min_order_amount',  '0'),
  ('business_hours', '{
    "saturday":  {"open": "10:00", "close": "23:00"},
    "sunday":    {"open": "10:00", "close": "23:00"},
    "monday":    {"open": "10:00", "close": "23:00"},
    "tuesday":   {"open": "10:00", "close": "23:00"},
    "wednesday": {"open": "10:00", "close": "23:00"},
    "thursday":  {"open": "10:00", "close": "23:00"},
    "friday":    {"open": "14:00", "close": "23:00"}
  }'),
  ('announcement_banner', 'null'),
  ('address', '"شارع قناة السويس بجوار المحمدي، المنصورة"');
