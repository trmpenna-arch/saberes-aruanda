-- Allow anyone to check if an email exists in the admins table
CREATE POLICY "Public can view admins" 
ON public.admins FOR SELECT 
USING (true);
