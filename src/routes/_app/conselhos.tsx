import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { pedirConselho } from "@/lib/conselho.functions";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/conselhos")({
  head: () => ({
    meta: [
      { title: "Conselhos com Pai Joaquim — Saberes de Aruanda" },
      { name: "description", content: "Converse com Pai Joaquim de Aruanda e receba conselhos espirituais inspirados na sabedoria dos Pretos-Velhos da Umbanda." },
      { property: "og:title", content: "Conselhos com Pai Joaquim" },
      { property: "og:description", content: "Sabedoria dos Pretos-Velhos para guiar o seu caminho." },
      { property: "og:url", content: SITE_URL + "/conselhos" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/conselhos" }],
  }),
  component: ConselhosPage,
});

function renderMensagem(texto: string) {
  // Convert **bold** segments to <strong>, preserve line breaks.
  const parts = texto.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function ConselhosPage() {
  const [problema, setProblema] = useState("");
  const fn = useServerFn(pedirConselho);
  const mutation = useMutation({
    mutationFn: (texto: string) => fn({ data: { problema: texto } }),
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const texto = problema.trim();
    if (texto.length < 5) return;
    mutation.mutate(texto);
  };

  const mensagem = mutation.data?.mensagem;

  return (
    <div className="space-y-6">
      <header className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-lg border-2 border-gold/20">
          <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Consulta espiritual</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">
          Conselhos de Pai Joaquim
        </h1>
        <div className="divider-gold" />
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Senta aqui um pouquinho com o velho. Conte o que aflige seu coração e receba uma palavra de luz de Aruanda.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card p-4 shadow-soft"
      >
        <p className="mb-3 text-center font-serif text-sm italic text-muted-foreground">
          “Salve a coroa de Pai Joaquim de Aruanda! O que aflige seu espírito hoje?”
        </p>
        <textarea
          value={problema}
          onChange={(e) => setProblema(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="Estou me sentindo cansado, desanimado, sem vontade de fazer nada..."
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          disabled={mutation.isPending}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">{problema.length}/2000</span>
          <button
            type="submit"
            disabled={mutation.isPending || problema.trim().length < 5}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Pai Joaquim está orando...
              </>
            ) : (
              <>
                Pedir conselho
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {mutation.isError && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-center text-sm text-destructive">
          {(mutation.error as Error)?.message?.includes("Unauthorized") 
            ? "O velho precisa saber quem é sunucê. Por favor, entre na sua conta para pedir um conselho."
            : (mutation.error as Error)?.message ?? "Algo não fluiu. Tente novamente, meu fio."}
        </div>
      )}

      {mensagem && (
        <article className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground">
            <Sparkles className="h-3 w-3" /> Mensagem de luz
          </span>
          <div className="rounded-2xl border border-border bg-sky-soft/40 p-5 shadow-soft">
            <div className="space-y-3 whitespace-pre-line font-serif text-[15px] italic leading-relaxed text-foreground/90">
              {renderMensagem(mensagem)}
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="h-3 w-3" /> Axé
            </p>
          </div>
        </article>
      )}

      <p className="pt-2 text-center text-xs italic text-muted-foreground">
        Os conselhos do velho são palavras de fé e não substituem orientação médica, psicológica ou profissional.
      </p>
    </div>
  );
}
