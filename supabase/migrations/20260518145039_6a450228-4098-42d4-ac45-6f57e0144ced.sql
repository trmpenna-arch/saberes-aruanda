-- Create learning_paths table
CREATE TABLE public.learning_paths (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create learning_path_courses junction table
CREATE TABLE public.learning_path_courses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(learning_path_id, course_id)
);

-- Create lesson_progress table
CREATE TABLE public.lesson_progress (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.course_lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policies for learning_paths
CREATE POLICY "Learning paths are viewable by everyone" 
ON public.learning_paths FOR SELECT USING (true);

-- Policies for learning_path_courses
CREATE POLICY "Learning path courses are viewable by everyone" 
ON public.learning_path_courses FOR SELECT USING (true);

-- Policies for lesson_progress
CREATE POLICY "Users can view their own progress" 
ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit their own progress" 
ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- Insert initial learning paths
INSERT INTO public.learning_paths (title, description, slug, image_url) VALUES 
('Jornada do Iniciante', 'Do primeiro passo no terreiro até o entendimento dos fundamentos básicos.', 'jornada-do-iniciante', 'https://images.unsplash.com/photo-1518005020480-388d589d9e22?auto=format&fit=crop&q=80&w=1200'),
('Formação Mediúnica', 'Trilha completa para o desenvolvimento e equilíbrio da sua mediunidade.', 'formacao-mediunica', 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=1200');

-- Link courses to paths (using slugs for reference in a subquery)
DO $$
DECLARE
    path_iniciante_id UUID;
    path_mediunidade_id UUID;
BEGIN
    SELECT id INTO path_iniciante_id FROM public.learning_paths WHERE slug = 'jornada-do-iniciante';
    SELECT id INTO path_mediunidade_id FROM public.learning_paths WHERE slug = 'formacao-mediunica';

    -- Jornada do Iniciante
    INSERT INTO public.learning_path_courses (learning_path_id, course_id, order_index)
    SELECT path_iniciante_id, id, 1 FROM public.courses WHERE slug = 'umbanda-para-iniciantes';
    
    INSERT INTO public.learning_path_courses (learning_path_id, course_id, order_index)
    SELECT path_iniciante_id, id, 2 FROM public.courses WHERE slug = 'fundamentos-da-umbanda-sagrada';

    -- Formação Mediúnica
    INSERT INTO public.learning_path_courses (learning_path_id, course_id, order_index)
    SELECT path_mediunidade_id, id, 1 FROM public.courses WHERE slug = 'desenvolvimento-mediunico';
    
    INSERT INTO public.learning_path_courses (learning_path_id, course_id, order_index)
    SELECT path_mediunidade_id, id, 2 FROM public.courses WHERE slug = 'desobsessao';
END $$;