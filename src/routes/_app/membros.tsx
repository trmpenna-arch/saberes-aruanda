import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Sparkles, Video, BookOpen, Headphones, Check, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/membros")({
  head: () => ({
    meta: [
      { title: "Área de Membros — Saberes de Aruanda" },
      { name: "description", content: "Vídeo-aulas com Pai Joaquim, e-books avançados, áudios de pontos cantados e lives mensais para membros." },
      { property: "og:title", content: "Área de Membros — Saberes de Aruanda" },
      { property: "og:description", content: "Conteúdo exclusivo para membros: vídeo-aulas, e-books, áudios e lives." },
      { property: "og:url", content: SITE_URL + "/membros" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/membros" }],
  }),
  component: MembrosPage,
});

const beneficios = [
  { icon: Video, label: "Vídeo-aulas com Pai Joaquim" },
  { icon: BookOpen, label: "E-books avançados de Umbanda" },
  { icon: Headphones, label: "Áudios de pontos cantados" },
  { icon: Sparkles, label: "Lives mensais e tira-dúvidas" },
];

function MembrosPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !user.email) {
          setIsAdmin(false);
        } else {
          const { data } = await supabase
            .from('admins')
            .select('email')
            .eq('email', user.email)
            .maybeSingle();
          setIsAdmin(!!data);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-6">
        <div className="mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Acesso Restrito</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          A Área de Membros está em desenvolvimento e o acesso antecipado é exclusivo para administradores.
        </p>
        <Link to="/">
          <Button variant="outline" className="mt-6 rounded-full">
            Voltar para o Início
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <section className="rounded-3xl gradient-sacred border border-border/60 px-6 py-10 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full gradient-gold shadow-gold">
          <Sparkles className="h-5 w-5 text-gold-foreground" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Área de Membros</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">
          Aprofunde sua jornada
        </h1>
        <div className="divider-gold" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Em breve, conteúdos exclusivos para quem deseja caminhar mais fundo na sabedoria de Aruanda.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-serif text-xl font-semibold">O que você terá acesso</h2>
        <ul className="mt-4 space-y-3">
          {beneficios.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-sky-soft text-primary">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-sm text-foreground">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gold/40 bg-gold/5 p-6 text-center">
        <Lock className="mx-auto h-6 w-6 text-gold" />
        <h3 className="mt-3 font-serif text-lg font-semibold">Em breve: assinatura premium</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Cadastro, login e pagamento serão liberados na próxima fase.
        </p>
        <div className="mt-5 flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-gold" /> Assinatura mensal com todo o catálogo
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-gold" /> Cursos avulsos para temas específicos
          </span>
        </div>
        <Link
          to="/conta"
          className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft"
        >
          Quero ser avisado
        </Link>
      </section>
    </div>
  );
}
