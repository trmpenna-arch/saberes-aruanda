import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { estudos } from "@/data/content";
import { EstudoCard, SectionHeader } from "@/components/EstudoCard";
import { getContentSettings } from "@/lib/cms";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/estudos/")({
  head: () => ({
    meta: [
      { title: "Estudos de Umbanda — Saberes de Aruanda" },
      { name: "description", content: "Biblioteca de estudos de Umbanda: fundamentos, entidades, ritualística e cursos avançados guiados por Pai Joaquim." },
      { property: "og:title", content: "Estudos de Umbanda" },
      { property: "og:description", content: "Caminhe com Pai Joaquim pelas bases da nossa fé." },
      { property: "og:url", content: SITE_URL + "/estudos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/estudos" }],
  }),
  component: EstudosPage,
});

function EstudosPage() {
  const [settings, setSettings] = useState<any[]>([]);

  useEffect(() => {
    getContentSettings().then(setSettings).catch(console.error);
  }, []);

  const mergedEstudos = estudos.map(staticEstudo => {
    const dbEstudo = settings.find(s => s.type === 'estudo' && s.slug === staticEstudo.slug);
    return {
      ...staticEstudo,
      imageUrl: dbEstudo?.image_url || staticEstudo.imageUrl
    };
  });

  const categorias = ["Fundamentos", "Entidades", "Ritualística", "Avançado"] as const;
  
  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Biblioteca</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">Estudos de Umbanda</h1>
        <div className="divider-gold" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Caminhe com Pai Joaquim pelas bases da nossa fé.
        </p>
      </header>

      {categorias.map((cat) => {
        const lista = mergedEstudos.filter((e) => e.categoria === cat);
        if (lista.length === 0) return null;
        return (
          <section key={cat}>
            <SectionHeader title={cat} />
            <div className="space-y-3">
              {lista.map((e) => (
                <EstudoCard key={e.slug} estudo={e} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
