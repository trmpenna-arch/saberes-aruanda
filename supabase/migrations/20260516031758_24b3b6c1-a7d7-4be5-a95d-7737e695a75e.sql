-- Allow admins to insert new admins
CREATE POLICY "Admins can insert admins" 
ON public.admins FOR INSERT 
WITH CHECK (public.is_admin());

-- Allow admins to delete other admins
CREATE POLICY "Admins can delete admins" 
ON public.admins FOR DELETE 
USING (public.is_admin());
