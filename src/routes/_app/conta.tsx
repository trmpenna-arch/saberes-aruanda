import { createFileRoute } from "@tanstack/react-router";
import { User, Bell, Heart, Info } from "lucide-react";

const SITE_URL = "https://saberes-sagrados-aruanda.lovable.app";

export const Route = createFileRoute("/_app/conta")({
  head: () => ({
    meta: [
      { title: "Minha Conta — Saberes de Aruanda" },
      { name: "description", content: "Gerencie suas preferências, notificações e favoritos no app Saberes de Aruanda." },
      { property: "og:title", content: "Minha Conta" },
      { property: "og:description", content: "Configurações da sua conta no Saberes de Aruanda." },
      { property: "og:url", content: SITE_URL + "/conta" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/conta" }],
  }),
  component: ContaPage,
});

function ContaPage() {
  const items = [
    { icon: Bell, label: "Notificações de novos estudos" },
    { icon: Heart, label: "Favoritos" },
    { icon: Info, label: "Sobre Pai Joaquim de Aruanda" },
  ];
  return (
    <div className="space-y-6">
      <section className="rounded-3xl gradient-sacred border border-border/60 px-6 py-8 text-center shadow-soft">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-card shadow-gold">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-serif text-2xl font-semibold">Bem-vindo, filho de fé</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Em breve você poderá criar sua conta e salvar seu progresso.
        </p>
      </section>

      <ul className="space-y-2">
        {items.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-soft text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-sm text-foreground">{label}</span>
          </li>
        ))}
      </ul>

      <p className="pt-4 text-center text-xs italic text-muted-foreground">
        Saravá Aruanda 🙏
      </p>
    </div>
  );
}
