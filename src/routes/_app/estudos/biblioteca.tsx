import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getLibraryItems, getUserSubscriptionStatus } from "@/lib/courses";
import { Book, FileText, Download, Lock, ChevronLeft, GraduationCap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/_app/estudos/biblioteca")({
  component: Biblioteca,
});

function Biblioteca() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: libraryItems, isLoading } = useQuery({
    queryKey: ["libraryItems"],
    queryFn: getLibraryItems,
  });

  const { data: subStatus } = useQuery({
    queryKey: ["userSubscription"],
    queryFn: getUserSubscriptionStatus,
  });

  const isPremium = subStatus?.is_premium || false;

  const filteredItems = libraryItems?.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="rounded-full -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: "/estudos" })}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para Escola
          </Button>
          <div className="space-y-1">
            <h1 className="font-serif text-4xl font-black text-foreground tracking-tight">Biblioteca de Membros</h1>
            <p className="text-muted-foreground text-sm font-medium">E-books, guias e materiais complementares exclusivos.</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar materiais..." 
            className="pl-12 h-12 rounded-2xl border-border/50 bg-card shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse rounded-3xl overflow-hidden border-none shadow-soft">
              <div className="aspect-[3/4] bg-muted w-full" />
              <CardHeader className="space-y-3 p-6">
                <div className="h-6 w-3/4 bg-muted rounded-lg" />
                <div className="h-4 w-1/2 bg-muted rounded-lg" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredItems?.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed rounded-[40px] border-border/50 bg-muted/20">
          <div className="h-20 w-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Book className="h-10 w-10 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-bold">Nenhum material encontrado</h3>
          <p className="text-muted-foreground max-w-xs mx-auto mt-2">Tente outro termo de busca ou explore as categorias disponíveis.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems?.map((item) => {
            const isLocked = item.is_advanced && !isPremium;
            
            return (
              <Card key={item.id} className={`group overflow-hidden border-border/50 bg-card flex flex-col h-full transition-all duration-300 rounded-[32px] ${isLocked ? 'opacity-90' : 'hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-1 border-none shadow-soft'}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img 
                    src={item.thumbnail_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"} 
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center text-white p-6 text-center">
                      <div className="h-14 w-14 rounded-2xl bg-gold/20 flex items-center justify-center mb-4 border border-gold/30">
                        <Lock className="h-7 w-7 text-gold" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest text-gold mb-1">Acesso Premium</p>
                      <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Torne-se um apoiador</p>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <Badge className={`${item.is_advanced ? "bg-gold" : "bg-primary"} text-white border-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest shadow-lg`}>
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col flex-1 p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-gold transition-colors line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground font-medium line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 mt-auto">
                    {isLocked ? (
                      <Button asChild className="w-full bg-gold hover:bg-gold/90 text-white font-black rounded-2xl h-12 shadow-lg shadow-gold/20">
                        <Link to="/conta">ASSINAR PREMIUM</Link>
                      </Button>
                    ) : (
                      <Button 
                        className="w-full gap-2 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl h-12 shadow-lg shadow-primary/20"
                        onClick={() => window.open(item.file_url, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                        BAIXAR AGORA
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
