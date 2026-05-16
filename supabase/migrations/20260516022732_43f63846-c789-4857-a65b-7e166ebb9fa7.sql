-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for public read access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'content-images');

-- Policy for uploads (simplified for CMS access)
CREATE POLICY "Anyone can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'content-images');

-- Policy for updates
CREATE POLICY "Anyone can update images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'content-images');

-- Policy for deletion
CREATE POLICY "Anyone can delete images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'content-images');