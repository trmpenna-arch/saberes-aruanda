import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-3.5">
        <Link to="/" className="flex items-center gap-2.5">
          <img 
            src="/logo.png" 
            alt="Logo Saberes de Aruanda" 
            className="h-10 w-10 object-contain rounded-full drop-shadow-md" 
          />
          <span className="leading-tight">
            <span className="block font-serif text-base font-semibold text-foreground">
              Saberes de Aruanda
            </span>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-gold">
              Pai Joaquim
            </span>
          </span>
        </Link>
        <div className="commonninja_component pid-967db095-59af-4d80-a2a0-18377ab9d3cd"></div>
      </div>
    </header>
  );
}
