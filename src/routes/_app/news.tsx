import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_app/news")({
  component: NewsPage,
});

function NewsPage() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">
          News TU.ZEB
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-1/4 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6">
            {news?.map((item) => (
              <Card key={item.id} className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(item.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                  <CardTitle className="font-serif text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {item.content && (
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {item.content}
                    </p>
                  )}
                  {item.pdf_url && (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      Visualizar PDF
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}

            {news?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma notícia publicada ainda.
              </div>
            )}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
