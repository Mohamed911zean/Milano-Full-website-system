-- ============================================================
-- 006 — Customer Enhancements
-- ============================================================

-- Add user_id to orders to link with authenticated customers
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS for orders to allow users to see their own orders
DROP POLICY IF EXISTS "orders_public_read_own" ON orders;
CREATE POLICY "orders_user_read_own" ON orders
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (user_id IS NULL AND auth.role() = 'anon') -- Fallback for guest orders
  );

-- ============================================================
-- Support Tickets
-- ============================================================

CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');

CREATE TABLE support_tickets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id      uuid REFERENCES orders(id) ON DELETE SET NULL,
  subject       text NOT NULL,
  message       text NOT NULL,
  status        ticket_status NOT NULL DEFAULT 'open',
  priority      ticket_priority NOT NULL DEFAULT 'medium',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Users can see and create their own tickets
CREATE POLICY "tickets_user_all" ON support_tickets
  FOR ALL USING (auth.uid() = user_id);

-- Staff can see all tickets
CREATE POLICY "tickets_staff_read" ON support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE id = auth.uid()
    )
  );

-- Staff can update status
CREATE POLICY "tickets_staff_update" ON support_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM staff_profiles
      WHERE id = auth.uid()
    )
  );

-- ============================================================
-- Customer Profiles (Extended Data)
-- ============================================================

CREATE TABLE customer_profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text,
  phone         text CHECK (phone ~ '^01[0-9]{9}$'),
  address       text,
  avatar_url    text,
  preferences   jsonb DEFAULT '{}'::jsonb,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customer_profiles_user_all" ON customer_profiles
  FOR ALL USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER customer_profiles_updated_at
  BEFORE UPDATE ON customer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
