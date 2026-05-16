import { createFileRoute, Link } from "@tanstack/react-router";
import { entidades } from "@/data/content";
import { useState } from "react";
import { 
  Users, 
  Search, 
  ArrowLeft, 
  Sparkles,
  Baby,
  Skull,
  Anchor,
  Wind,
  Compass,
  Briefcase
} from "lucide-react";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/entidades/")({
  head: () => ({
    meta: [
      { title: "Entidades da Umbanda — Saberes de Aruanda" },
      { name: "description", content: "Caboclos, Pretos-Velhos, Baianos, Erês, Boiadeiros, Ciganos, Marinheiros e Malandros — guias da direita na Umbanda." },
      { property: "og:title", content: "Entidades da Umbanda" },
      { property: "og:description", content: "Conheça os guias da direita e suas falanges." },
      { property: "og:url", content: SITE_URL + "/entidades" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/entidades" }],
  }),
  component: EntidadesPage,
});

type EntidadeTipo = typeof entidades[number]["tipo"];

function EntidadesPage() {
  const [filtro, setFiltro] = useState<EntidadeTipo | "Todos">("Todos");

  const tipos: (EntidadeTipo | "Todos")[] = [
    "Todos",
    "Caboclos",
    "Pretos-velhos",
    "Baianos",
    "Erês",
    "Boiadeiros",
    "Ciganos",
    "Marinheiros",
    "Malandros",
  ];

  const filtradas = filtro === "Todos" 
    ? entidades 
    : entidades.filter((e) => e.tipo === filtro);

  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Trabalhadores de Aruanda</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">Entidades e Guias</h1>
        <div className="divider-gold" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Conheça as falanges de luz que atuam na caridade e no auxílio espiritual.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tipos.map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition ${
              filtro === tipo
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-card border border-border text-muted-foreground hover:border-gold/50"
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtradas.map((entidade) => (
          <Link
            key={entidade.slug}
            to="/entidades/$slug"
            params={{ slug: entidade.slug }}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-gold hover:shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                  {entidade.tipo}
                </span>
                <h2 className="mt-1 font-serif text-xl font-bold text-foreground group-hover:text-gold transition">
                  {entidade.nome}
                </h2>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white transition-colors">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground italic line-clamp-2">
              "{entidade.resumo}"
            </p>

            <div className="space-y-3 pt-2 border-t border-border/50">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-foreground/60 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Atuação
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1">
                  {entidade.atuacao}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-foreground/60 flex items-center gap-1">
                  <Compass className="h-3 w-3" /> Saudação
                </span>
                <p className="text-xs font-serif italic text-primary">
                  {entidade.saudacao}
                </p>
              </div>
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
