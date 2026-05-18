import { createFileRoute, Outlet, useLocation, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "@/components/BottomNav";
import { Home, BookOpen, Sparkles, Heart, MessageCircleHeart, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const location = useLocation();
  const isLessonPage = location.pathname.includes('/aula/');

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'a')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Até breve!");
      window.location.href = "/";
    }
  };

  const navItems = [
    { to: "/", label: "Início", icon: Home },
    { to: "/estudos", label: "Cursos", icon: BookOpen },
    { to: "/oracoes", label: "Orações", icon: Heart },
    { to: "/conselhos", label: "Conselhos", icon: MessageCircleHeart },
    { to: "/membros", label: "Membros", icon: Sparkles },
    { to: "/conta", label: "Conta", icon: User },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar for Desktop */}
      {!isLessonPage && (
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-border/60 bg-card/40 backdrop-blur-xl z-50">
          <div className="p-8">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain rounded-full shadow-gold" />
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold text-foreground leading-tight">Saberes de Aruanda</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-black">Pai Joaquim</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const active = item.to === "/" 
                ? location.pathname === "/" 
                : location.pathname.startsWith(item.to);
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
                    active 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${active ? "text-white" : "text-gold"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${!isLessonPage ? 'md:pl-64' : ''}`}>
        {!isLessonPage && (
          <div className="md:hidden sticky top-0 z-40">
            <SiteHeader />
          </div>
        )}
        
        <main className={`mx-auto w-full max-w-5xl px-5 md:px-12 pt-6 pb-28 md:pb-12 ${isLessonPage ? 'pt-0 max-w-none px-0' : ''}`}>
          <Outlet />
        </main>

        {!isLessonPage && (
          <div className="md:hidden">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}
