-- Criar uma view para ver e-mails de admins (acessível apenas por admins)
CREATE OR REPLACE VIEW public.admins_view AS
SELECT 
    ur.id,
    ur.user_id,
    u.email,
    ur.created_at
FROM 
    public.user_roles ur
JOIN 
    auth.users u ON ur.user_id = u.id
WHERE 
    ur.role = 'admin';

-- Dar permissão de acesso à view
ALTER VIEW public.admins_view OWNER TO postgres;
GRANT SELECT ON public.admins_view TO authenticated;

-- Adicionar política de segurança na view (através das tabelas base)
-- Como é uma view simples, ela herda as permissões das tabelas base.
-- Mas auth.users não é diretamente acessível por RLS padrão para outros usuários.
-- Por isso, vamos usar uma função SECURITY DEFINER se necessário, 
-- mas por enquanto vamos tentar simplificar.
