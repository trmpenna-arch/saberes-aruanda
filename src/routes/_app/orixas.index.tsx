import { createFileRoute, Link } from "@tanstack/react-router";
import { orixas } from "@/data/content";
import { ArrowLeft, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/_app/orixas/")({
  component: OrixasIndex,
});

function OrixasIndex() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Sagrados Tronos</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">Os Orixás</h1>
        <div className="divider-gold" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Conheça as divindades que regem a natureza e os sentidos da vida na Umbanda Sagrada.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {orixas.map((orixa) => (
          <Link
            key={orixa.slug}
            to="/orixas/$slug"
            params={{ slug: orixa.slug }}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-gold hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground group-hover:text-gold">
                {orixa.nome}
              </h2>
              <Sparkles className="h-5 w-5 text-gold opacity-50" />
            </div>
            
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {orixa.resumo}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-soft px-2.5 py-1 text-[10px] font-medium text-primary uppercase tracking-wider">
                <Star className="h-3 w-3" /> {orixa.forcas.split(",")[0]}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Ver detalhes
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-4 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </Link>
      </div>
    </div>
  );
}
