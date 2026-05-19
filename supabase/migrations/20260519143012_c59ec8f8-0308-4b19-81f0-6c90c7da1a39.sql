-- Simplify the SELECT policy for admins table to strictly avoid recursion
DROP POLICY IF EXISTS "Enable read access for users checking their own status" ON public.admins;
CREATE POLICY "Users can view their own admin status" 
ON public.admins 
FOR SELECT 
TO authenticated 
USING (email = (auth.jwt() ->> 'email'));

-- Also fix the INSERT/UPDATE/DELETE policies to be more robust if possible,
-- but for now, SELECT was the main issue for the dashboard loading.
