import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { oracoes } from "@/data/content";

export const Route = createFileRoute("/_app/oracoes/")({
  component: OracoesPage,
});

function OracoesPage() {
  return (
    <div className="space-y-6">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Fé e devoção</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">Orações</h1>
        <div className="divider-gold" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Preces para abrir caminhos, agradecer e firmar a fé.
        </p>
      </header>

      <ul className="space-y-3">
        {oracoes.map((o) => (
          <li key={o.slug}>
            <Link
              to="/oracoes/$slug"
              params={{ slug: o.slug }}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-gold hover:shadow-soft"
            >
              <span className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gold/15 text-gold">
                <Heart className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-base font-semibold text-foreground">{o.titulo}</p>
                <p className="text-xs text-muted-foreground">{o.destinatario}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
