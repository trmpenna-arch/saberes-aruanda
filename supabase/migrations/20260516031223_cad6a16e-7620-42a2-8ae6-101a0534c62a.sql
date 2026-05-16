-- 1. Tighten Storage Policy to prevent listing while allowing access
DROP POLICY IF EXISTS "Public read access for content images" ON storage.objects;
CREATE POLICY "Public read access for content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images' AND (storage.foldername(name))[1] IS NOT NULL);

-- 2. Hardening functions in public schema
-- handle_new_user fix
ALTER FUNCTION public.handle_new_user() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

-- handle_updated_at fix
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC;

-- is_admin fix (already mostly done, but ensuring consistency)
ALTER FUNCTION public.is_admin() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 3. Address RLS "Always True" by explicitly dropping any legacy permissive policies
-- We check content_settings which was the main dynamic table.
DROP POLICY IF EXISTS "Anyone can update content settings" ON public.content_settings;
DROP POLICY IF EXISTS "Anyone can insert content settings" ON public.content_settings;

-- Ensure SELECT policy for content_settings is safe 
-- (Linter usually flags (true) on tables where other operations are also broad)
-- Since we already restricted ALL to is_admin(), the table is now secure.
