-- Função para sincronizar admins com user_roles
CREATE OR REPLACE FUNCTION public.sync_admin_role()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Tenta encontrar o usuário pelo e-mail e dar a role de admin
        INSERT INTO public.user_roles (user_id, role)
        SELECT id, 'admin'
        FROM auth.users
        WHERE email = NEW.email
        ON CONFLICT (user_id, role) DO NOTHING;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Remove a role de admin do usuário associado ao e-mail
        DELETE FROM public.user_roles
        WHERE role = 'admin' AND user_id IN (
            SELECT id FROM auth.users WHERE email = OLD.email
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gatilho na tabela admins
DROP TRIGGER IF EXISTS on_admin_change ON public.admins;
CREATE TRIGGER on_admin_change
AFTER INSERT OR DELETE ON public.admins
FOR EACH ROW EXECUTE FUNCTION public.sync_admin_role();

-- Sincronizar dados existentes
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'
FROM public.admins a
JOIN auth.users u ON a.email = u.email
ON CONFLICT (user_id, role) DO NOTHING;
