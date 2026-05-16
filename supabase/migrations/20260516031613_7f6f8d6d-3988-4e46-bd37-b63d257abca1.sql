-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Insert initial admin
INSERT INTO public.admins (email) 
VALUES ('trmpenna@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Policies for admins table (only admins can manage it)
CREATE POLICY "Admins can view admins" 
ON public.admins FOR SELECT 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

-- Update is_admin function to use the table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = (auth.jwt() ->> 'email')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
