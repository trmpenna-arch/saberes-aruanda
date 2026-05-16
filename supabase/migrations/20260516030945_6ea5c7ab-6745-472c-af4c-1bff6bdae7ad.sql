-- Fix search path and restrict execution permissions for is_admin
ALTER FUNCTION public.is_admin() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
