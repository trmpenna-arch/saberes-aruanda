import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, Sparkles, Heart, MessageCircleHeart, User } from "lucide-react";

const items = [
  { to: "/", label: "Início", icon: Home },
  { to: "/estudos", label: "Cursos", icon: BookOpen },
  { to: "/oracoes", label: "Orações", icon: Heart },
  { to: "/conselhos", label: "Conselhos", icon: MessageCircleHeart },
  { to: "/membros", label: "Membros", icon: Sparkles },
  { to: "/conta", label: "Conta", icon: User },
] as const;

export function BottomNav() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/90 backdrop-blur-md">
      <ul className="mx-auto flex max-w-xl items-stretch justify-between px-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                    active ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
