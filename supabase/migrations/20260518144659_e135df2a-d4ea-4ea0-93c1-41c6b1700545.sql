-- Add category column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'courses' AND COLUMN_NAME = 'category') THEN
    ALTER TABLE public.courses ADD COLUMN category TEXT DEFAULT 'Geral';
  END IF;
END $$;

-- Update existing courses with requested categories
UPDATE public.courses SET category = 'Iniciante' WHERE slug IN ('umbanda-para-iniciantes', 'cambone-a-base-do-terreiro');
UPDATE public.courses SET category = 'Fundamentos' WHERE slug IN ('teologia-da-umbanda', 'tronqueiras-e-conga', 'fundamentos-da-umbanda-sagrada');
UPDATE public.courses SET category = 'Mediunidade' WHERE slug IN ('desenvolvimento-mediunico', 'quebra-de-demanda', 'desobsessao');
UPDATE public.courses SET category = 'Liderança' WHERE slug IN ('formacao-de-sacerdote');