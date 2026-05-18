import { createFileRoute, Link, useNavigate, getRouteApi } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseBySlug, checkCourseAccess, toggleLessonProgress, getLessonProgress } from "@/lib/courses";
import { ChevronLeft, Clock, Award, BookOpen, Lock, Play, CheckCircle2, Circle, GraduationCap, Flame, Star, Waves, Users, Church, HelpCircle, Library } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/estudos/$slug")({
  component: CourseDetail,
});

const routeApi = getRouteApi("/_app/estudos/$slug");

function CourseDetail() {
  const { slug } = routeApi.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: course, isLoading, error: courseError } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourseBySlug(slug),
  });

  const { data: hasAccess } = useQuery({
    queryKey: ["course-access", course?.id],
    queryFn: () => (course ? checkCourseAccess(course.id) : false),
    enabled: !!course,
  });

  const { data: progress } = useQuery({
    queryKey: ["course-progress", course?.id],
    queryFn: () => (course ? getLessonProgress(course.id) : []),
    enabled: !!course && !!hasAccess,
  });

  if (isLoading || !course) {
    if (courseError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="bg-muted rounded-full p-4 mb-4">
            <GraduationCap className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Curso não encontrado</h2>
          <p className="text-muted-foreground mt-2 max-w-xs">
            O curso que você está procurando não foi encontrado ou ainda não está disponível.
          </p>
          <Button asChild className="mt-6 bg-gold hover:bg-gold/90 text-white font-bold">
            <Link to="/estudos">Voltar para a Escola</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8 px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="aspect-video w-full rounded-3xl bg-muted" />
          <div className="flex gap-4">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const totalLessons = course.course_lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Group lessons by module (simple heuristic: first word of title or a custom field if we had one)
  // For now, let's just use the index to group them into simulated modules if module_name is missing
  const lessonsWithModules = course.course_lessons?.map((l, idx) => ({
    ...l,
    module: (l as any).module_name || `Módulo ${Math.floor(idx / 3) + 1}`
  })) || [];

  const modules = Array.from(new Set(lessonsWithModules.map(l => l.module)));

  const isTeologia = slug === "teologia-da-umbanda";

  return (
    <div className="space-y-8 pb-20 px-1">
      {/* Hero Section */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-soft">
        <img
          src={course.image_url || "https://images.unsplash.com/photo-1518005020480-388d589d9e22?auto=format&fit=crop&q=80&w=1200"}
          alt={course.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50" onClick={() => navigate({ to: "/estudos" })}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <Badge className="mb-3 bg-gold text-white hover:bg-gold/90 border-none px-3">
            {course.level}
          </Badge>
          <h1 className="font-serif text-3xl font-bold leading-tight drop-shadow-lg">{course.title}</h1>
        </div>
      </div>

      {/* Access/CTA Section */}
      {!hasAccess && course.price_cents > 0 ? (
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Investimento Vitalício</p>
              <h3 className="text-3xl font-bold text-foreground">
                R$ {(course.price_cents / 100).toFixed(2)}
              </h3>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                size="lg" 
                className="bg-gold hover:bg-gold/90 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-gold/20"
                onClick={async () => {
                  toast.info("Redirecionando para checkout...");
                }}
              >
                Garantir minha vaga
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-gold">
                <Link to="/conta">Ver planos de assinatura</Link>
              </Button>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            Acesso liberado imediatamente após a confirmação
          </p>
        </div>
      ) : hasAccess && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-gold/20 bg-gold/5 shadow-none overflow-hidden h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Seu Progresso</span>
                <span className="text-sm font-bold text-gold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-gold/10" />
              <p className="mt-3 text-xs text-muted-foreground">
                {completedLessons} de {totalLessons} aulas concluídas
              </p>
            </CardContent>
          </Card>
          <Card className="border-gold/20 bg-primary shadow-none overflow-hidden h-full">
            <CardContent className="p-5 flex items-center justify-between text-white">
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Biblioteca do Curso</h4>
                <p className="text-[10px] opacity-70 uppercase tracking-widest">Materiais extras</p>
              </div>
              <Button asChild size="sm" variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm">
                <Link to="/estudos/biblioteca">
                  <Library className="h-4 w-4 mr-2" />
                  Abrir
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info Badges */}
      <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gold" />
          <span>{course.duration} de conteúdo</span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-gold" />
          <span>Curso certificado</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gold" />
          <span>{totalLessons} aulas</span>
        </div>
      </div>

      {/* Curriculum by Modules */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold">Conteúdo Programático</h2>
        
        <div className="space-y-8">
          {modules.map((moduleName, modIdx) => {
            const moduleLessons = lessonsWithModules.filter(l => l.module === moduleName);
            const moduleCompleted = moduleLessons.filter(l => progress?.some(p => p.lesson_id === l.id && p.completed)).length;
            const modulePercentage = (moduleCompleted / moduleLessons.length) * 100;

            return (
              <div key={moduleName} className="space-y-4">
                <div className="flex items-center justify-between border-b border-gold/10 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-[10px] font-bold text-gold">
                      {modIdx + 1}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-primary uppercase tracking-tight">
                      {moduleName}
                    </h3>
                  </div>
                  {hasAccess && (
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">{moduleCompleted}/{moduleLessons.length} Aulas</span>
                      <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${modulePercentage}%` }} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-3">
                  {moduleLessons.map((lesson, idx) => {
                    const isCompleted = progress?.some(p => p.lesson_id === lesson.id && p.completed);
                    const isLocked = !hasAccess && !lesson.is_preview;
                    
                    return (
                      <div 
                        key={lesson.id}
                        className={`group flex items-center justify-between gap-4 p-4 rounded-2xl border transition-all ${
                          isLocked ? "bg-muted/30 border-border/50 opacity-70" : "bg-card border-border hover:border-gold/50 active:scale-[0.98]"
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCompleted ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                          }`}>
                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className={`font-medium text-sm truncate ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                                {lesson.title}
                              </h3>
                              {lesson.is_preview && !hasAccess && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-[9px] border-none">
                                  Amostra Grátis
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider mt-0.5">
                              {lesson.video_url ? "Vídeo Aula" : "Leitura"}
                            </span>
                          </div>
                        </div>
                        
                        {isLocked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-full text-gold hover:bg-gold/10"
                            onClick={() => navigate({ to: `/estudos/${slug}/aula/${lesson.slug}` })}
                          >
                            <Play className="h-5 w-5 fill-current" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold">Sobre este curso</h2>
        <p className="leading-relaxed text-muted-foreground text-sm">
          {course.description}
        </p>
      </div>
    </div>
  );
}