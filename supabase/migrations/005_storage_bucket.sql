-- ============================================================
-- 005 — Storage Bucket for Product Images
-- ============================================================

-- اعمل bucket public للصور
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,                          -- public: الصور بتتعرض على الموقع بدون auth
  2097152,                       -- 2MB max per file (بعد الـ compression هيبقى أقل بكتير)
  ARRAY['image/webp', 'image/jpeg', 'image/png']
);

-- ============================================================
-- Storage RLS Policies
-- ============================================================

-- الكل يقدر يقرأ (عشان الموقع يعرض الصور)
CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- بس الـ authenticated (owner/staff) يرفعوا أو يمسحوا
CREATE POLICY "product_images_auth_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "product_images_auth_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "product_images_auth_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    auth.role() = 'authenticated'
  );
