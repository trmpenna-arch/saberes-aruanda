import { Link } from "@tanstack/react-router";
import type { Estudo } from "@/data/content";

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function EstudoCard({ estudo }: { estudo: Estudo }) {
  return (
    <Link
      to="/estudos/$slug"
      params={{ slug: estudo.slug }}
      className="block rounded-2xl border border-border bg-card p-4 transition hover:border-gold hover:shadow-soft"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-sky-soft px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
          {estudo.categoria}
        </span>
        {estudo.premium ? (
          <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            Premium
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">{estudo.duracao}</span>
        )}
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground">{estudo.titulo}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{estudo.resumo}</p>
    </Link>
  );
}
