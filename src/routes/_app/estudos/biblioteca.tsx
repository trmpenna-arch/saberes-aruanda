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
    <div className="space-y-6 pb-20 px-1">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => navigate({ to: "/estudos" })}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Biblioteca de Membros</h1>
          <p className="text-muted-foreground text-xs">E-books, guias e materiais complementares exclusivos.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Buscar materiais..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-muted w-full" />
              <CardHeader className="space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : filteredItems?.length === 0 ? (
        <div className="py-20 text-center border border-dashed rounded-3xl">
          <Book className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium">Nenhum material encontrado</h3>
          <p className="text-sm text-muted-foreground">Tente outro termo de busca ou volte mais tarde.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems?.map((item) => {
            const isLocked = item.is_advanced && !isPremium;
            
            return (
              <Card key={item.id} className={`group overflow-hidden border-border/50 flex flex-col h-full transition-all ${isLocked ? 'opacity-80' : 'hover:shadow-soft hover:border-gold/50'}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img 
                    src={item.thumbnail_url || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400"} 
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center">
                      <Lock className="h-8 w-8 mb-2 text-gold" />
                      <p className="text-xs font-bold uppercase tracking-wider">Conteúdo Avançado</p>
                      <p className="text-[10px] opacity-80 mt-1">Disponível para Membros Premium</p>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={item.is_advanced ? "default" : "secondary"} className={item.is_advanced ? "bg-gold text-white" : ""}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-4 pb-2">
                  <h3 className="font-serif text-lg font-bold leading-tight line-clamp-2">{item.title}</h3>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-1">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  {isLocked ? (
                    <Button asChild className="w-full bg-gold hover:bg-gold/90 text-white font-bold">
                      <Link to="/conta">Assinar Premium</Link>
                    </Button>
                  ) : (
                    <Button 
                      className="w-full gap-2"
                      onClick={() => window.open(item.file_url, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                      Acessar Material
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
