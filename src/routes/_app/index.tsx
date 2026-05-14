import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Heart, Sparkles, Star } from "lucide-react";
import { estudos, oracoes } from "@/data/content";
import { EstudoCard, SectionHeader } from "@/components/EstudoCard";

export const Route = createFileRoute("/_app/")({
  component: Home,
});

function Home() {
  const fundamentos = estudos.filter((e) => e.categoria === "Fundamentos").slice(0, 3);
  const oracoesDestaque = oracoes.slice(0, 2);

  return (
    <div className="space-y-10">
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

      <section className="grid grid-cols-3 gap-3">
        {[
          { to: "/estudos" as const, icon: BookOpen, label: "Estudos" },
          { to: "/oracoes" as const, label: "Orações", icon: Heart },
          { to: "/membros" as const, label: "Membros", icon: Sparkles },
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

      <section>
        <SectionHeader title="Fundamentos da Umbanda" subtitle="Conteúdo gratuito para iniciantes" />
        <div className="space-y-3">
          {fundamentos.map((e) => (
            <EstudoCard key={e.slug} estudo={e} />
          ))}
        </div>
      </section>

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
