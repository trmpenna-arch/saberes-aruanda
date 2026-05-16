-- Function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'email' = 'trmpenna@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update content_settings RLS policies
DROP POLICY IF EXISTS "Public can view content settings" ON public.content_settings;
DROP POLICY IF EXISTS "Anyone can update content settings" ON public.content_settings;
DROP POLICY IF EXISTS "Anyone can insert content settings" ON public.content_settings;

-- Allow public read
CREATE POLICY "Public can view content settings"
ON public.content_settings
FOR SELECT
USING (true);

-- Allow only admin to manage content
CREATE POLICY "Admin can manage content settings"
ON public.content_settings
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Update storage policies for 'content-images' bucket
DROP POLICY IF EXISTS "Public read access for content images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads for content images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates for content images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes for content images" ON storage.objects;

-- Allow public read access (necessary for the app to show images)
CREATE POLICY "Public read access for content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-images');

-- Allow only admin to upload/update/delete
CREATE POLICY "Admin can manage content images"
ON storage.objects FOR ALL
USING (bucket_id = 'content-images' AND public.is_admin())
WITH CHECK (bucket_id = 'content-images' AND public.is_admin());
