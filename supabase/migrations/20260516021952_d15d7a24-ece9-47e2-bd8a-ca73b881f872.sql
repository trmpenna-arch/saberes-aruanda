-- Create a table for content overrides (images, etc)
CREATE TABLE public.content_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'orixa' or 'estudo'
    slug TEXT NOT NULL,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(type, slug)
);

-- Enable RLS
ALTER TABLE public.content_settings ENABLE ROW LEVEL SECURITY;

-- Allow public to read
CREATE POLICY "Public can view content settings" 
ON public.content_settings FOR SELECT 
USING (true);

-- Allow authenticated users to update (assuming the user will be logged in to manage)
CREATE POLICY "Authenticated users can manage content settings" 
ON public.content_settings FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_content_settings_updated_at
BEFORE UPDATE ON public.content_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();