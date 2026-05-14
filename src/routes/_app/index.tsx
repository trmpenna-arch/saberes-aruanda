import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Heart, Sparkles, Star } from "lucide-react";
import { estudos, oracoes } from "@/data/content";

export const Route = createFileRoute("/_app/")({
  component: Home,
});

function Home() {
  const fundamentos = estudos.filter((e) => e.categoria === "Fundamentos").slice(0, 3);
  const oracoesDestaque = oracoes.slice(0, 2);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-sacred border border-border/60 px-6 py-10 text-center shadow-soft">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full gradient-gold shadow-gold">
          <Star className="h-5 w-5 text-gold-foreground" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Saravá Aruanda</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-foreground">
          Saberes de Aruanda
        </h1>
        <p className="mt-1 font-serif text-lg italic text-primary">com Pai Joaquim</p>
        <div className="divider-gold" />
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Estude a sagrada Umbanda — fundamentos, orações, guias e a sabedoria dos
          Pretos-Velhos no conforto da sua casa.
        </p>
        <Link
          to="/estudos"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90"
        >
          Começar a estudar
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Categorias rápidas */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { to: "/estudos", icon: BookOpen, label: "Estudos" },
          { to: "/oracoes", label: "Orações", icon: Heart },
          { to: "/membros", label: "Membros", icon: Sparkles },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition hover:border-gold hover:shadow-gold"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-soft text-primary group-hover:bg-gold/15 group-hover:text-gold">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-medium text-foreground">{label}</span>
          </Link>
        ))}
      </section>

      {/* Fundamentos */}
      <section>
        <SectionHeader title="Fundamentos da Umbanda" subtitle="Conteúdo gratuito para iniciantes" />
        <div className="space-y-3">
          {fundamentos.map((e) => (
            <EstudoCard key={e.slug} estudo={e} />
          ))}
        </div>
      </section>

      {/* Orações */}
      <section>
        <SectionHeader title="Orações sagradas" subtitle="Para fortalecer a fé no dia a dia" />
        <div className="space-y-3">
          {oracoesDestaque.map((o) => (
            <Link
              key={o.slug}
              to="/oracoes/$slug"
              params={{ slug: o.slug }}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-gold hover:shadow-soft"
            >
              <span className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold/15 text-gold">
                <Heart className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-base font-semibold text-foreground">{o.titulo}</p>
                <p className="text-xs text-muted-foreground">{o.destinatario}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <p className="pb-2 text-center text-xs italic text-muted-foreground">
        “A humildade é a porta de entrada para a luz.” — Pai Joaquim de Aruanda
      </p>
    </div>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

import type { Estudo } from "@/data/content";
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
