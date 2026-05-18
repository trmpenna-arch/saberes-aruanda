-- Fix search path for trigger function
ALTER FUNCTION public.update_library_items_updated_at() SET search_path = public;

-- Add audio_url to course_lessons if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'course_lessons' AND column_name = 'audio_url') THEN
    ALTER TABLE public.course_lessons ADD COLUMN audio_url TEXT;
  END IF;
END $$;
