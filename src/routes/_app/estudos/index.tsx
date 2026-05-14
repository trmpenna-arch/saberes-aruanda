import { createFileRoute } from "@tanstack/react-router";
import { estudos } from "@/data/content";
import { EstudoCard, SectionHeader } from "@/components/EstudoCard";

export const Route = createFileRoute("/_app/estudos/")({
  component: EstudosPage,
});

function EstudosPage() {
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
        const lista = estudos.filter((e) => e.categoria === cat);
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
