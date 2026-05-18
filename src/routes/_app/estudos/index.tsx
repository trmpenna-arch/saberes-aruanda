import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/courses";
import { GraduationCap, Clock, Award, ChevronRight, Settings, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useMemo } from "react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


export const Route = createFileRoute("/_app/estudos/")({
  component: CursosIndex,
});

function CursosIndex() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('admins').select('email').eq('email', user.email || '').maybeSingle().then(({ data }) => {
          setIsAdmin(!!data);
        });
      }
    });
  }, []);

  const categories = useMemo(() => {
    if (!courses) return ["todos"];
    const cats = new Set(courses.map(c => c.category).filter(Boolean));
    return ["todos", ...Array.from(cats)].sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    if (activeTab === "todos") return courses;
    return courses.filter(c => c.category === activeTab);
  }, [courses, activeTab]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl font-bold text-foreground">Escola de Aruanda</h1>
          <p className="text-muted-foreground text-sm">Aprofunde seu conhecimento com nossos cursos guiados.</p>
        </div>
        {isAdmin && (
          <Button variant="outline" size="icon" onClick={() => navigate({ to: "/conta" })} title="Painel Administrativo">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-10 -mx-4 overflow-x-auto bg-background/95 px-4 pb-2 pt-1 backdrop-blur supports-[backdrop-filter]:bg-background/60 scrollbar-hide">
          <TabsList className="inline-flex w-auto bg-muted/50 p-1">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat} 
                className="rounded-md px-4 py-1.5 text-xs font-medium capitalize transition-all data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {cat === "todos" ? "Todos os Cursos" : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full" />
                  <CardHeader className="space-y-2 p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center text-destructive">
              Ocorreu um erro ao carregar os cursos. Tente novamente mais tarde.
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-medium">Nenhum curso nesta categoria</h3>
              <p className="text-sm text-muted-foreground">Pai Joaquim está preparando ensinamentos profundos para você nesta área.</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-gold" 
                onClick={() => setActiveTab("todos")}
              >
                Ver todos os cursos
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Link key={course.id} to={`/cursos/${course.slug}`}>
                  <Card className="group flex h-full flex-col overflow-hidden border-border/50 transition-all hover:border-gold/50 hover:shadow-soft active:scale-[0.98]">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={course.image_url || "https://images.unsplash.com/photo-1518005020480-388d589d9e22?auto=format&fit=crop&q=80&w=800"}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <Badge variant="secondary" className="bg-background/90 text-[10px] backdrop-blur-sm">
                          {course.level}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-gold transition-colors">{course.title}</h3>
                    </CardHeader>
                    <CardContent className="flex-1 px-4 py-0">
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {course.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-4">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gold/70" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-gold/70" />
                          <span>Certificado</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {course.price_cents === 0 ? "Grátis" : `R$ ${(course.price_cents / 100).toFixed(0)}`}
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
