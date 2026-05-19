import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCourses, getLearningPaths } from "@/lib/courses";
import { GraduationCap, Clock, Award, ChevronRight, Settings, Filter, Map, PlayCircle, CheckCircle2 } from "lucide-react";
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

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const { data: paths, isLoading: isLoadingPaths } = useQuery({
    queryKey: ["learningPaths"],
    queryFn: getLearningPaths,
  });

  const isLoading = isLoadingCourses || isLoadingPaths;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle().then(({ data }) => {
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
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-3xl font-bold text-foreground">Escola de Aruanda</h1>
          <p className="text-muted-foreground text-xs">Sua jornada de evolução espiritual guiada por Pai Joaquim.</p>
        </div>
        {isAdmin && (
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate({ to: "/conta" })} title="Painel Administrativo">
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </div>

      {paths && paths.length > 0 && activeTab === "todos" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Map className="h-5 w-5 text-gold" />
            <h2 className="font-serif text-xl font-bold">Trilhas de Aprendizado</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {paths.map((path) => (
              <Card key={path.id} className="min-w-[280px] max-w-[320px] shrink-0 overflow-hidden border-gold/10 bg-gradient-to-br from-card to-gold/5">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={path.image_url} alt={path.title} className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-lg font-bold text-white drop-shadow-md">{path.title}</h3>
                  </div>
                </div>
                <CardContent className="p-4 pt-3">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{path.description}</p>
                  <div className="space-y-2">
                    {path.courses?.slice(0, 3).map((course, idx) => (
                      <div key={course.id} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold/10 text-gold font-bold">{idx + 1}</span>
                        <span className="truncate">{course.title}</span>
                      </div>
                    ))}
                    {path.courses && path.courses.length > 3 && (
                      <span className="text-[10px] text-muted-foreground pl-6">+{path.courses.length - 3} mais cursos</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" size="sm" className="w-full border-gold/20 text-gold hover:bg-gold/5" onClick={() => navigate({ to: `/estudos?category=${path.slug}` })}>
                    Iniciar Jornada
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

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
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <h3 className="mt-4 text-lg font-medium">Nenhum curso encontrado</h3>
              <p className="text-sm text-muted-foreground">Pai Joaquim está preparando ensinamentos profundos para você.</p>
              <Button 
                variant="ghost" 
                className="mt-4 text-gold" 
                onClick={() => setActiveTab("todos")}
              >
                Ver todos os cursos
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <Link key={course.id} to={`/estudos/${course.slug}`}>
                  <Card className="group flex h-full flex-col overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-gold/50 hover:shadow-gold hover:bg-card active:scale-[0.98] rounded-[1.5rem]">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={course.image_url || "https://images.unsplash.com/photo-1518005020480-388d589d9e22?auto=format&fit=crop&q=80&w=800"}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                      <div className="absolute top-3 left-3 flex gap-1">
                        <Badge variant="secondary" className="bg-white/90 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm text-primary border-none shadow-sm px-2 py-0.5">
                          {course.level}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/90 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                          <PlayCircle className="h-5 w-5 fill-current" />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="p-5 pb-2">
                      <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-gold transition-colors duration-300">{course.title}</h3>
                    </CardHeader>
                    <CardContent className="flex-1 px-5 py-0">
                      <p className="line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed font-medium">
                        {course.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-4 p-5 pt-4">
                      <div className="flex w-full items-center justify-between border-t border-border/40 pt-4">
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-gold" />
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-gold" />
                            <span>Certificado</span>
                          </div>
                        </div>
                        <span className="text-base font-black text-primary">
                          {course.price_cents === 0 ? "Grátis" : `R$ ${(course.price_cents / 100).toFixed(0)}`}
                        </span>
                      </div>
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
