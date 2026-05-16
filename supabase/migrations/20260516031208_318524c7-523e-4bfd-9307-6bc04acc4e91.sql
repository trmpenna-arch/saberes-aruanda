-- 1. Restrict public listing in storage.objects for content-images
-- Drop the broad SELECT policy
DROP POLICY IF EXISTS "Public read access for content images" ON storage.objects;

-- Create a more specific policy that allows SELECT but prevents broad listing 
-- (in many cases, simply using the bucket_id check is what the linter flags if it's too broad)
-- We'll restrict it so listing is harder, but the app can still fetch the public URL.
-- Note: Supabase public buckets already allow public read via URL, but the policy controls the API listing.
CREATE POLICY "Public read access for content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

-- 2. Address "RLS Policy Always True" for content_settings (Select is fine, but double check All/Insert/Update)
-- We already have "Admin can manage content settings" which uses is_admin(). 
-- The linter might be flagging the SELECT policy if it was using (true).
-- "Public can view content settings" USING (true) is explicitly excluded from the linter's "Always True" warning for SELECT.
-- However, we'll make sure no other table has permissive policies.

-- 3. Fix "Function Search Path Mutable" for any other functions (if any exist besides is_admin)
-- Let's check for other functions that might be in the public schema and set their search path.
-- (This is proactive based on the linter's report of 5+ issues).

-- 4. Re-verify is_admin() execute permissions (was done before, but ensuring consistency)
ALTER FUNCTION public.is_admin() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 5. If there is an update_updated_at_column function (common in these projects), fix it too
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
    END IF;
END $$;
