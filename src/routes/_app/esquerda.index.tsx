import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { esquerda } from "@/data/content";
import { getContentSettings } from "@/lib/cms";
import { ArrowLeft, Sparkles, ShieldAlert, Star } from "lucide-react";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/esquerda/")({
  head: () => ({
    meta: [
      { title: "Linha de Esquerda — Exus, Pomba Giras e Exu Mirins" },
      { name: "description", content: "Exus, Pomba Giras e Exu Mirins — guardiões da Lei que atuam na proteção, equilíbrio e limpeza das energias." },
      { property: "og:title", content: "A Linha de Esquerda na Umbanda" },
      { property: "og:description", content: "Os Guardiões da Lei: proteção, equilíbrio e limpeza das energias." },
      { property: "og:url", content: SITE_URL + "/esquerda" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/esquerda" }],
  }),
  component: EsquerdaIndex,
});

function EsquerdaIndex() {
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    getContentSettings().then(setSettings).catch(console.error);
  }, []);

  const mergedEsquerda = esquerda.map(staticEsquerda => {
    const dbEsquerda = settings.find(s => s.type === 'esquerda' && s.slug === staticEsquerda.slug);
    return {
      ...staticEsquerda,
      imageUrl: dbEsquerda?.image_url || staticEsquerda.imageUrl
    };
  });

  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-destructive">Os Guardiões da Lei</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-foreground">A Linha de Esquerda</h1>
        <div className="divider-gold mx-auto" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Conheça os guardiões que atuam na proteção, no equilíbrio e na limpeza das energias densas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mergedEsquerda.map((item) => (
          <Link
            key={item.slug}
            to="/esquerda/$slug"
            params={{ slug: item.slug }}
            className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-gold hover:shadow-soft"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/20 bg-muted flex items-center justify-center">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.nome} 
                    className="h-full w-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-destructive opacity-50" />
                )}
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground group-hover:text-gold flex-1">
                {item.nome}
              </h2>
            </div>
            
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
              {item.resumo}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-medium text-destructive uppercase tracking-wider">
                <ShieldAlert className="h-3 w-3" /> {item.tipo}
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