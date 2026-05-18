-- Add is_premium to profiles if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_premium') THEN
    ALTER TABLE public.profiles ADD COLUMN is_premium BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create library_items table
CREATE TABLE IF NOT EXISTS public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  file_url TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., 'E-book', 'PDF', 'Guia'
  is_advanced BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for library_items
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;

-- Policies for library_items
CREATE POLICY "Anyone can view published library items" 
ON public.library_items 
FOR SELECT 
USING (is_published = true);

-- Create library_item_access table (to track progress/downloads)
CREATE TABLE IF NOT EXISTS public.library_item_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.library_items(id) ON DELETE CASCADE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS for library_item_access
ALTER TABLE public.library_item_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own library access" 
ON public.library_item_access 
FOR ALL 
USING (auth.uid() = user_id);

-- Add update trigger for library_items
CREATE OR REPLACE FUNCTION public.update_library_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_library_items_updated_at
BEFORE UPDATE ON public.library_items
FOR EACH ROW
EXECUTE FUNCTION public.update_library_items_updated_at();
