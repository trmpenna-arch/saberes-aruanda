-- Add plano column to assinaturas table
ALTER TABLE public.assinaturas ADD COLUMN IF NOT EXISTS plano TEXT DEFAULT 'gratis';
ALTER TABLE public.assinaturas ADD COLUMN IF NOT EXISTS cancelamento_solicitado BOOLEAN DEFAULT false;
ALTER TABLE public.assinaturas ADD COLUMN IF NOT EXISTS expiracao TIMESTAMP WITH TIME ZONE;

-- Update existing records if any
UPDATE public.assinaturas SET plano = 'premium' WHERE ativa = true AND plano = 'gratis';

-- Add RLS policies for assinaturas if not present
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" 
ON public.assinaturas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.assinaturas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.assinaturas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);
