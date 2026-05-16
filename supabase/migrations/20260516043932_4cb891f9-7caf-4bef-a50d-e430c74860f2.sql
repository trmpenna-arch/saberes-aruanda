-- Remove public read access to admins
DROP POLICY IF EXISTS "Public can view admins" ON public.admins;

-- Remove anonymous write access to content-images bucket
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete images" ON storage.objects;