import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import { estudos } from "@/data/content";
import { getContentSettings } from "@/lib/cms";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/estudos/$slug")({
  component: EstudoDetalhe,
  loader: ({ params }) => {
    const estudo = estudos.find((e) => e.slug === params.slug);
    if (!estudo) throw notFound();
    return { estudo };
  },
  head: ({ loaderData }) => {
    const e = loaderData?.estudo;
    if (!e) return {};
    const url = `${SITE_URL}/estudos/${e.slug}`;
    return {
      meta: [
        { title: `${e.titulo} — Estudos de Umbanda` },
        { name: "description", content: e.resumo },
        { property: "og:title", content: e.titulo },
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
            headline: e.titulo,
            description: e.resumo,
            author: { "@type": "Person", name: "Pai Joaquim" },
            publisher: { "@type": "Organization", name: "Saberes de Aruanda" },
            url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-12 text-center">
      <p className="text-sm text-muted-foreground">Estudo não encontrado.</p>
      <Link to="/estudos" className="mt-4 inline-block text-sm text-primary underline">
        Voltar para estudos
      </Link>
    </div>
  ),
});

function EstudoDetalhe() {
  const { estudo: staticEstudo } = Route.useLoaderData();
  const [dbImage, setDbImage] = useState<string | null>(null);

  useEffect(() => {
    getContentSettings().then(settings => {
      const setting = settings.find(s => s.type === 'estudo' && s.slug === staticEstudo.slug);
      if (setting?.image_url) {
        setDbImage(setting.image_url);
      }
    }).catch(console.error);
  }, [staticEstudo.slug]);

  const imageUrl = dbImage || staticEstudo.imageUrl;

  return (
    <article className="space-y-6">
      <Link
        to="/estudos"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Estudos
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gold/20 bg-muted flex items-center justify-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={staticEstudo.titulo} 
                className="h-full w-full object-cover" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <Sparkles className="h-6 w-6 text-gold opacity-50" />
            )}
          </div>
          <div>
            <span className="rounded-full bg-sky-soft px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
              {staticEstudo.categoria}
            </span>
            <h1 className="mt-1 font-serif text-2xl font-semibold leading-tight">{staticEstudo.titulo}</h1>
            <p className="text-xs text-muted-foreground">{staticEstudo.duracao}</p>
          </div>
        </div>
        <div className="h-px w-16 bg-gold" />
      </header>

      {staticEstudo.premium ? (
        <div className="rounded-2xl border border-gold/40 bg-gold/5 p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="font-serif text-xl font-semibold">Conteúdo exclusivo de Membros</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Este curso faz parte da nossa área premium. Em breve você poderá assinar e acessar todas as
            vídeo-aulas com Pai Joaquim.
          </p>
          <Link
            to="/membros"
            className="mt-5 inline-block rounded-full bg-gold px-5 py-2 text-sm font-medium text-gold-foreground shadow-gold"
          >
            Conhecer a área de membros
          </Link>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          {staticEstudo.conteudo.map((paragrafo: string, i: number) => (
            <p key={i} className="text-[15px] leading-relaxed text-foreground/90">
              {paragrafo}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}
