-- Remover a view que causava problemas de segurança
DROP VIEW IF EXISTS public.admins_view;

-- Corrigir a função para incluir search_path
CREATE OR REPLACE FUNCTION public.sync_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.user_roles (user_id, role)
        SELECT id, 'admin'
        FROM auth.users
        WHERE email = NEW.email
        ON CONFLICT (user_id, role) DO NOTHING;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        DELETE FROM public.user_roles
        WHERE role = 'admin' AND user_id IN (
            SELECT id FROM auth.users WHERE email = OLD.email
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;
