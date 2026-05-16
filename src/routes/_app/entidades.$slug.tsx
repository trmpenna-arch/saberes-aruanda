import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { entidades } from "@/data/content";
import { getContentSettings } from "@/lib/cms";
import { 
  ArrowLeft, 
  Sparkles, 
  Users,
  Star,
  Flower2,
  Milk,
  Zap,
  Hammer,
  GraduationCap,
  Palette
} from "lucide-react";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/entidades/$slug")({
  head: ({ params }) => {
    const e = entidades.find((x) => x.slug === params.slug);
    if (!e) return {};
    const url = `${SITE_URL}/entidades/${e.slug}`;
    return {
      meta: [
        { title: `${e.nome} — ${e.tipo} da Umbanda` },
        { name: "description", content: e.resumo },
        { property: "og:title", content: `${e.nome} — Umbanda` },
        { property: "og:description", content: e.resumo },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: e.nome,
            description: e.resumo,
            publisher: { "@type": "Organization", name: "Saberes de Aruanda" },
            url,
          }),
        },
      ],
    };
  },
  component: EntidadeDetails,
});

function EntidadeDetails() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    getContentSettings().then(setSettings).catch(console.error);
  }, []);

  const dbEntidade = settings.find(s => s.type === 'entidade' && s.slug === slug);
  const staticEntidade = entidades.find((e) => e.slug === slug);
  const entidade = staticEntidade ? { ...staticEntidade, imageUrl: dbEntidade?.image_url || staticEntidade.imageUrl } : null;

  if (!entidade) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">Entidade não encontrada</h1>
        <Link to="/entidades" className="mt-4 text-primary hover:underline">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  const sections = [
    { title: "Regência", content: entidade.regencia, icon: Star, color: "text-amber-500" },
    { title: "Atuação", content: entidade.atuacao, icon: Zap, color: "text-blue-500" },
    { title: "Saudação", content: entidade.saudacao, icon: Sparkles, color: "text-gold" },
    { title: "Elementos", content: entidade.elementos, icon: Palette, color: "text-purple-500" },
    { title: "Flores", content: entidade.flores, icon: Flower2, color: "text-pink-500" },
    { title: "Frutas", content: entidade.frutas, icon: Milk, color: "text-orange-500" },
    { title: "Ferramentas", content: entidade.ferramentas, icon: Hammer, color: "text-slate-500" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft min-h-[300px] flex items-center justify-center p-8">
        {entidade.imageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={entidade.imageUrl} 
              alt="" 
              className="h-full w-full object-cover opacity-20 blur-[2px]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-card/80 to-card" />
          </div>
        )}
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <Link 
            to="/entidades"
            className="mb-6 self-start inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar para Entidades
          </Link>
          
          <div className="mb-6 flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border-4 border-gold bg-card shadow-gold/20 shadow-xl">
            {entidade.imageUrl ? (
              <img 
                src={entidade.imageUrl} 
                alt={entidade.nome} 
                className="h-full w-full object-contain p-2"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Users className="h-16 w-16 text-primary" />
            )}
          </div>
          
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">{entidade.nome}</h1>
          <div className="divider-gold mx-auto" />
          <p className="max-w-xl text-lg italic text-muted-foreground">
            {entidade.resumo}
          </p>
        </div>
        
        {!entidade.imageUrl && (
          <>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
          </>
        )}
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-serif text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Características
        </h2>
        <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
          {entidade.caracteristicas}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:border-gold/30">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 ${section.color}`}>
                <section.icon className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80">
                {section.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-center">
        <button 
          onClick={() => navigate({ to: "/entidades" })}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-3 text-sm font-medium transition hover:border-gold hover:bg-gold/5"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para a lista
        </button>
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}