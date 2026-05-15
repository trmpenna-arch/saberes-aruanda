import { createFileRoute, Link } from "@tanstack/react-router";
import { esquerda } from "@/data/content";
import { 
  ShieldAlert, 
  ArrowLeft, 
  Sparkles,
  Flame,
  Zap,
  Moon,
  Shield,
  Ghost
} from "lucide-react";

export const Route = createFileRoute("/_app/esquerda/")({
  component: EsquerdaIndex,
});

function EsquerdaIndex() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-destructive">Os Guardiões da Lei</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight text-foreground">A Linha de Esquerda</h1>
        <div className="h-0.5 w-24 bg-destructive/30 mx-auto mt-4" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground mt-4">
          Conheça os guardiões que atuam na proteção, no equilíbrio e na limpeza das energias densas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {esquerda.map((item) => (
          <Link
            key={item.slug}
            to="/esquerda/$slug"
            params={{ slug: item.slug }}
            className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition hover:border-destructive/40 hover:shadow-soft relative overflow-hidden text-left"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-destructive/5 blur-2xl group-hover:bg-destructive/10 transition-colors" />
            
            <div className="flex items-center justify-between relative z-10">
              <h2 className="font-serif text-2xl font-bold text-foreground group-hover:text-destructive transition">
                {item.nome}
              </h2>
              <ShieldAlert className="h-6 w-6 text-destructive opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground italic relative z-10">
              "{item.resumo}"
            </p>

            <div className="space-y-4 pt-4 border-t border-border/50 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-destructive/80 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Atuação
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.atuacao}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-destructive/80 flex items-center gap-1">
                  <Flame className="h-3 w-3" /> Elementos
                </span>
                <p className="text-xs text-muted-foreground">
                  {item.elementos}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-destructive/80 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Saudação
                </span>
                <p className="text-xs font-serif italic text-destructive font-semibold">
                  {item.saudacao}
                </p>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full border border-border shadow-sm"
                    style={{ background: item.cores.toLowerCase().includes('preto') && item.cores.toLowerCase().includes('vermelho') 
                      ? 'linear-gradient(45deg, #000 50%, #dc2626 50%)' 
                      : '#dc2626' 
                    }}
                  />
                  <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.cores}</span>
            </div>
          </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </Link>
      </div>
    </div>
  );
}
