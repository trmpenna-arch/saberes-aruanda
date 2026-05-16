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
      className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-gold hover:shadow-soft"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/20 bg-muted flex items-center justify-center">
          {estudo.imageUrl ? (
            <img 
              src={estudo.imageUrl} 
              alt={estudo.titulo} 
              className="h-full w-full object-cover" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sky-soft text-primary">
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {estudo.categoria[0]}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center justify-between gap-2">
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
          <h3 className="truncate font-serif text-lg font-semibold text-foreground group-hover:text-gold">
            {estudo.titulo}
          </h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-1">
        {estudo.resumo}
      </p>
    </Link>
  );
}
