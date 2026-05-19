-- Create news table
CREATE TABLE public.news (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    pdf_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "News are viewable by everyone" 
ON public.news FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage news" 
ON public.news FOR ALL
USING (is_admin());

-- Storage buckets for news assets
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('news-pdfs', 'news-pdfs', true);

-- Storage policies
CREATE POLICY "News images are public" ON storage.objects FOR SELECT USING (bucket_id = 'news-images');
CREATE POLICY "News pdfs are public" ON storage.objects FOR SELECT USING (bucket_id = 'news-pdfs');

CREATE POLICY "Admins can upload news images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'news-images' AND is_admin()
);

CREATE POLICY "Admins can upload news pdfs" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'news-pdfs' AND is_admin()
);