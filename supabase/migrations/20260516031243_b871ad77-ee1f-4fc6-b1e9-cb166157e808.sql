-- 1. Remove the broad "Anyone can manage content settings" policy
DROP POLICY IF EXISTS "Anyone can manage content settings" ON public.content_settings;

-- 2. Clean up storage policies
DROP POLICY IF EXISTS "Public read access for content images" ON storage.objects;
-- Re-create a single clean public read policy for the bucket
CREATE POLICY "Public read access for content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

-- 3. Function security hardening
-- Setting search path and revoking public access for system functions
ALTER FUNCTION public.handle_new_user() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;

ALTER FUNCTION public.handle_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM authenticated;

-- Ensure is_admin is also fully locked down except for authenticated use of the logic
ALTER FUNCTION public.is_admin() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
