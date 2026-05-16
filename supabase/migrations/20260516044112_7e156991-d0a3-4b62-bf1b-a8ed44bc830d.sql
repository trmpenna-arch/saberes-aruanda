DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;

CREATE POLICY "Admins can view admins"
ON public.admins
FOR SELECT
USING (public.is_admin());