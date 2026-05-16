import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { orixas } from "@/data/content";
import { 
  ArrowLeft, 
  Sparkles, 
  Star, 
  MapPin, 
  Leaf, 
  Gem, 
  Flower2, 
  Milk,
  Anchor,
  Shield,
  Zap,
  Heart,
  Flame,
  Scale,
  Sun,
  Moon,
  Wind,
  Trash2,
  Dna,
  History,
  GraduationCap
} from "lucide-react";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/orixas/$slug")({
  head: ({ params }) => {
    const orixa = orixas.find((o) => o.slug === params.slug);
    if (!orixa) return {};
    const url = `${SITE_URL}/orixas/${orixa.slug}`;
    return {
      meta: [
        { title: `${orixa.nome} — Orixá da Umbanda` },
        { name: "description", content: orixa.resumo },
        { property: "og:title", content: `${orixa.nome} — Orixá da Umbanda` },
        { property: "og:description", content: orixa.resumo },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(orixa.imageUrl ? [{ property: "og:image" as const, content: orixa.imageUrl }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: orixa.nome,
            description: orixa.resumo,
            image: orixa.imageUrl,
            publisher: { "@type": "Organization", name: "Saberes de Aruanda" },
            url,
          }),
        },
      ],
    };
  },
  component: OrixaDetails,
});

function OrixaDetails() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const orixa = orixas.find((o) => o.slug === slug);

  if (!orixa) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">Orixá não encontrado</h1>
        <Link to="/orixas" className="mt-4 text-primary hover:underline">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  const sections = [
    { title: "Forças Relacionadas", content: orixa.forcas, icon: Star, color: "text-amber-500" },
    { title: "Principais Entidades", content: orixa.entidades, icon: Sparkles, color: "text-gold" },
    { title: "Trono", content: orixa.trono, icon: MapPin, color: "text-sky-500" },
    { title: "Pedras", content: orixa.pedras, icon: Gem, color: "text-purple-500" },
    { title: "Ervas para Banho", content: orixa.ervas, icon: Leaf, color: "text-green-500" },
    { title: "Flores", content: orixa.flores, icon: Flower2, color: "text-pink-500" },
    { title: "Frutas", content: orixa.frutas, icon: Milk, color: "text-orange-500" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft min-h-[300px] flex items-center justify-center p-8">
        {orixa.imageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={orixa.imageUrl} 
              alt="" 
              className="h-full w-full object-cover opacity-20 blur-[2px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-card/80 to-card" />
          </div>
        )}
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <Link 
            to="/orixas"
            className="mb-6 self-start inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar para Orixás
          </Link>
          
          <div className="mb-6 flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl border-4 border-gold bg-card shadow-gold/20 shadow-xl">
            {orixa.imageUrl ? (
              <img 
                src={orixa.imageUrl} 
                alt={orixa.nome} 
                className="h-full w-full object-contain p-2"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.error("Erro ao carregar imagem principal:", orixa.imageUrl);
                  const target = e.currentTarget;
                  if (target.src !== "https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=1000&auto=format&fit=crop") {
                    target.src = "https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=1000&auto=format&fit=crop";
                  }
                }}
              />
            ) : (
              <Sparkles className="h-16 w-16 text-gold" />
            )}
          </div>
          
          <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">{orixa.nome}</h1>
          <div className="divider-gold mx-auto" />
          <p className="max-w-xl text-lg italic text-muted-foreground">
            {orixa.resumo}
          </p>
        </div>
        
        {!orixa.imageUrl && (
          <>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          </>
        )}
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="mb-4 font-serif text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" /> Características
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          {orixa.caracteristicas}
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
          onClick={() => navigate({ to: "/orixas" })}
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
