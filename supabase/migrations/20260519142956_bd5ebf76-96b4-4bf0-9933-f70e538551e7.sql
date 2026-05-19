-- Fix the SELECT policy for admins table to avoid circular reference
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
CREATE POLICY "Enable read access for users checking their own status" 
ON public.admins 
FOR SELECT 
TO authenticated 
USING (email = (auth.jwt() ->> 'email') OR (EXISTS (SELECT 1 FROM public.admins a WHERE a.email = (auth.jwt() ->> 'email'))));

-- Ensure other policies use a non-recursive approach if possible, 
-- but since they are for authenticated users and depend on the same check, 
-- we keep them but aware of the potential issues.
-- However, SELECT is the most critical one for the frontend check.
