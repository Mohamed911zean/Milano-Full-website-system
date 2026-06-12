-- ============================================================
-- 007 — BI & Customers Enhancements
-- ============================================================

-- 1. Wishlists Table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlists_user_all" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

-- 2. Customer Profiles Email
ALTER TABLE customer_profiles ADD COLUMN IF NOT EXISTS email text;

-- 3. Orders Owner Email
ALTER TABLE orders ADD COLUMN IF NOT EXISTS owner_email text;

-- 4. Backfill existing data
-- Update customer_profiles with emails from auth.users
UPDATE customer_profiles cp
SET email = au.email
FROM auth.users au
WHERE cp.id = au.id AND cp.email IS NULL;

-- Update historical orders with owner_email from auth.users
UPDATE orders o
SET owner_email = au.email
FROM auth.users au
WHERE o.user_id = au.id AND o.owner_email IS NULL;

-- 5. Trigger to auto-populate customer_profiles on signup
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customer_profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_profile();
