-- ============================================================
-- 008 - Admin customer RLS access
-- ============================================================

-- customer_profiles has RLS enabled. Customers can manage their own
-- profile, while admins can read all customer profiles for the dashboard.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'customer_profiles'
      AND policyname = 'customer_profiles_user_all'
  ) THEN
    CREATE POLICY "customer_profiles_user_all" ON public.customer_profiles
      FOR ALL
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'customer_profiles'
      AND policyname = 'customer_profiles_admin_read'
  ) THEN
    CREATE POLICY "customer_profiles_admin_read" ON public.customer_profiles
      FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

-- Admin customer details reads wishlists for the selected customer.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'wishlists'
      AND policyname = 'wishlists_admin_read'
  ) THEN
    CREATE POLICY "wishlists_admin_read" ON public.wishlists
      FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;
