import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { esquerda } from "@/data/content";
import { 
  ArrowLeft, 
  ShieldAlert, 
  Flame, 
  Zap, 
  Sparkles, 
  Palette, 
  Users,
  GraduationCap,
  History,
  ShieldCheck,
  Sword
} from "lucide-react";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/esquerda/$slug")({
  head: ({ params }) => {
    const item = esquerda.find((e) => e.slug === params.slug);
    if (!item) return {};
    const url = `${SITE_URL}/esquerda/${item.slug}`;
    return {
      meta: [
        { title: `${item.nome} — ${item.tipo} da Umbanda` },
        { name: "description", content: item.resumo },
        { property: "og:title", content: `${item.nome} — ${item.tipo}` },
        { property: "og:description", content: item.resumo },
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
            headline: item.nome,
            description: item.resumo,
            publisher: { "@type": "Organization", name: "Saberes de Aruanda" },
            url,
          }),
        },
      ],
    };
  },
  component: EsquerdaDetails,
});

function EsquerdaDetails() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const item = esquerda.find((e) => e.slug === slug);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">Guardião não encontrado</h1>
        <Link to="/esquerda" className="mt-4 text-primary hover:underline">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  const sections = [
    { title: "Regência", content: item.regencia, icon: ShieldCheck, color: "text-destructive" },
    { title: "Atuação", content: item.atuacao, icon: Zap, color: "text-blue-500" },
    { title: "Saudação", content: item.saudacao, icon: Sparkles, color: "text-amber-500" },
    { title: "Elementos", content: item.elementos, icon: Flame, color: "text-orange-500" },
    { title: "Oferendas", content: item.oferendas, icon: Palette, color: "text-purple-500" },
    { title: "Cores", content: item.cores, icon: Palette, color: "text-slate-500" },
    { title: "Qualidades", content: item.qualidades, icon: Sword, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="relative z-10 flex flex-col items-center text-center">
          <Link 
            to="/esquerda"
            className="mb-6 self-start inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar para Esquerda
          </Link>
          
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-destructive/20 shadow-lg border border-destructive/20">
            <ShieldAlert className="h-10 w-10" />
          </div>
          
          <h1 className="font-serif text-4xl font-bold text-foreground">{item.nome}</h1>
          <div className="h-0.5 w-24 bg-destructive/30 mx-auto mt-4" />
          <p className="max-w-xl mt-4 text-lg italic text-muted-foreground">
            {item.resumo}
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-destructive/5 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-destructive/5 blur-3xl" />
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-serif text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-destructive" /> Características
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          {item.caracteristicas}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-serif text-2xl font-semibold flex items-center gap-2">
          <Users className="h-6 w-6 text-destructive" /> Nomes Conhecidos
        </h2>
        <div className="flex flex-wrap gap-2">
          {item.nomesFamosos.map((nome) => (
            <span key={nome} className="rounded-full bg-destructive/10 border border-destructive/20 px-4 py-1.5 text-sm font-medium text-destructive">
              {nome}
            </span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:border-destructive/30">
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
          onClick={() => navigate({ to: "/esquerda" })}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-3 text-sm font-medium transition hover:border-destructive hover:bg-destructive/5"
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
