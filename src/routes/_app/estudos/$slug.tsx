import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { estudos } from "@/data/content";

export const Route = createFileRoute("/_app/estudos/$slug")({
  component: EstudoDetalhe,
  loader: ({ params }) => {
    const estudo = estudos.find((e) => e.slug === params.slug);
    if (!estudo) throw notFound();
    return { estudo };
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
  const { estudo } = Route.useLoaderData();

  return (
    <article className="space-y-6">
      <Link
        to="/estudos"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Estudos
      </Link>

      <header>
        <span className="rounded-full bg-sky-soft px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
          {estudo.categoria}
        </span>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight">{estudo.titulo}</h1>
        <p className="mt-1 text-xs text-muted-foreground">{estudo.duracao}</p>
        <div className="mt-3 h-px w-16 bg-gold" />
      </header>

      {estudo.premium ? (
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
          {estudo.conteudo.map((paragrafo, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-foreground/90">
              {paragrafo}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}
