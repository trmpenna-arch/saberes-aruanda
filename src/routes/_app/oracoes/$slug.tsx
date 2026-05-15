import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { oracoes } from "@/data/content";

const SITE_URL = "https://aruanda-saberes-sagrados.lovable.app";

export const Route = createFileRoute("/_app/oracoes/$slug")({
  component: OracaoDetalhe,
  loader: ({ params }) => {
    const oracao = oracoes.find((o) => o.slug === params.slug);
    if (!oracao) throw notFound();
    return { oracao };
  },
  head: ({ loaderData }) => {
    const o = loaderData?.oracao;
    if (!o) return {};
    const url = `${SITE_URL}/oracoes/${o.slug}`;
    const desc = `Oração dedicada a ${o.destinatario}. Reze e firme a sua fé na Umbanda.`;
    return {
      meta: [
        { title: `${o.titulo} — Oração de Umbanda` },
        { name: "description", content: desc },
        { property: "og:title", content: o.titulo },
        { property: "og:description", content: desc },
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
            headline: o.titulo,
            description: desc,
            publisher: { "@type": "Organization", name: "Saberes de Aruanda" },
            url,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-12 text-center">
      <p className="text-sm text-muted-foreground">Oração não encontrada.</p>
      <Link to="/oracoes" className="mt-4 inline-block text-sm text-primary underline">
        Voltar para orações
      </Link>
    </div>
  ),
});

function OracaoDetalhe() {
  const { oracao } = Route.useLoaderData();
  return (
    <article className="space-y-6">
      <Link
        to="/oracoes"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Orações
      </Link>
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{oracao.destinatario}</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">{oracao.titulo}</h1>
        <div className="divider-gold" />
      </header>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <p className="font-serif text-[17px] leading-relaxed text-foreground/90 whitespace-pre-line">
          {oracao.texto}
        </p>
      </div>
    </article>
  );
}
