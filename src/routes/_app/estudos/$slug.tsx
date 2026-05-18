import { createFileRoute, Link, useNavigate, getRouteApi } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseBySlug, checkCourseAccess, toggleLessonProgress, getLessonProgress } from "@/lib/courses";
import { ChevronLeft, Clock, Award, BookOpen, Lock, Play, CheckCircle2, Circle, GraduationCap, Flame, Star, Waves, Users, Church, HelpCircle, Library, ClipboardList, ShieldCheck, Leaf, Music, Wind } from "lucide-react";
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

  const lessonsWithModules = course.course_lessons?.map((l, idx) => ({
    ...l,
    module: (l as any).module_name || `Módulo ${Math.floor(idx / 3) + 1}`
  })) || [];

  const modules = Array.from(new Set(lessonsWithModules.map(l => l.module)));

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl shadow-2xl bg-black">
        <img
          src={course.image_url || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1600"}
          alt={course.title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute top-6 left-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/10" 
            onClick={() => navigate({ to: "/estudos" })}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute bottom-8 left-8 right-8 text-white max-w-2xl">
          <Badge className="mb-4 bg-gold text-black hover:bg-gold/90 border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
            {course.level}
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight drop-shadow-lg">{course.title}</h1>
          <p className="mt-4 text-lg text-white/80 font-medium line-clamp-2 max-w-lg">{course.description}</p>
          <div className="flex flex-wrap items-center gap-6 mt-8 text-xs font-bold text-white/90">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              <span>{course.duration} DE CONTEÚDO</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gold" />
              <span>{totalLessons} AULAS</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-gold" />
              <span>CERTIFICADO</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <Card className="border-none bg-gradient-to-br from-card to-muted/20 shadow-none overflow-hidden rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-gold" />
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">Sobre o Curso</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground text-lg max-w-none">
                {course.description}
              </p>
            </CardContent>
          </Card>
          
          {/* Curriculum Section */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-gold" />
                </div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">Grade Curricular</h2>
              </div>
              {hasAccess && (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-black text-gold uppercase tracking-widest">{Math.round(progressPercentage)}% CONCLUÍDO</span>
                  <Progress value={progressPercentage} className="h-2 w-32 bg-muted rounded-full" />
                </div>
              )}
            </div>
            
            <div className="space-y-12">
              {modules.map((moduleName, modIdx) => {
                const moduleLessons = lessonsWithModules.filter(l => l.module === moduleName);
                const moduleCompleted = moduleLessons.filter(l => progress?.some(p => p.lesson_id === l.id && p.completed)).length;
                const modulePercentage = (moduleCompleted / moduleLessons.length) * 100;

                return (
                  <div key={moduleName} className="space-y-6">
                    <div className="flex flex-col gap-3 px-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold text-[14px] font-black text-white shadow-xl shadow-gold/20">
                            {modIdx + 1}
                          </span>
                          <h3 className="font-serif text-2xl font-bold text-primary tracking-tight">
                            {moduleName}
                          </h3>
                        </div>
                        {hasAccess && (
                          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                            {moduleCompleted}/{moduleLessons.length} AULAS
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {moduleLessons.map((lesson, idx) => {
                        const isCompleted = progress?.some(p => p.lesson_id === lesson.id && p.completed);
                        const isLocked = !hasAccess;
                        
                        return (
                          <div 
                            key={lesson.id}
                            className={`group flex items-center justify-between gap-4 p-6 rounded-[2rem] border transition-all duration-300 ${
                              isLocked 
                                ? "bg-muted/10 border-border/30 opacity-70" 
                                : "bg-card border-border/60 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/5 active:scale-[0.99]"
                            }`}
                          >
                            <div className="flex items-center gap-5 flex-1 min-w-0">
                              <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${
                                isCompleted ? "bg-green-500 text-white shadow-xl shadow-green-500/20 rotate-[360deg]" : "bg-muted text-muted-foreground group-hover:bg-gold/10 group-hover:text-gold"
                              }`}>
                                {isCompleted ? <CheckCircle2 className="h-7 w-7" /> : idx + 1}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-3">
                                  <h3 className={`font-bold text-lg md:text-xl truncate tracking-tight transition-colors ${isLocked ? "text-muted-foreground" : "text-foreground group-hover:text-gold"}`}>
                                    {lesson.title}
                                  </h3>
                                  {lesson.is_preview && !hasAccess && (
                                    <Badge className="bg-green-500 hover:bg-green-600 text-white text-[9px] border-none font-bold uppercase px-2">
                                      Grátis
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                                    {lesson.video_url ? <Play className="h-3 w-3 text-gold fill-current" /> : <BookOpen className="h-3 w-3 text-gold" />}
                                    {lesson.video_url ? "Vídeo Aula" : "Material de Estudo"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {isLocked ? (
                              <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                                <Lock className="h-5 w-5 text-muted-foreground/50" />
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-14 w-14 rounded-2xl bg-gold/5 text-gold hover:bg-gold hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-gold/20"
                                onClick={() => navigate({ to: `/estudos/${slug}/aula/${lesson.slug}` })}
                              >
                                <Play className="h-7 w-7 fill-current ml-1" />
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
        </div>

        <div className="space-y-8">
          {/* Access Card */}
          {!hasAccess && course.price_cents > 0 ? (
            <Card className="border-none bg-gradient-to-b from-primary to-primary/95 text-white shadow-2xl shadow-primary/20 overflow-hidden sticky top-8 rounded-[2.5rem]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <CardHeader className="pb-4 relative">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gold/80">Acesso Vitalício</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 relative">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gold">R$</span>
                  <span className="text-6xl font-black tracking-tighter">{(course.price_cents / 100).toFixed(2)}</span>
                </div>
                
                <div className="space-y-5">
                  {[
                    "Certificado de conclusão reconhecido",
                    "Suporte especializado para dúvidas",
                    "Materiais extras e e-books exclusivos",
                    "Acesso vitalício ao conteúdo"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-4 group/benefit">
                      <div className="h-6 w-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 border border-gold/30 group-hover/benefit:bg-gold/40 transition-colors">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                      </div>
                      <p className="text-sm text-white/80 font-medium">{benefit}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full h-16 bg-gold hover:bg-gold/90 text-black font-black text-xl rounded-2xl shadow-xl shadow-gold/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => toast.info("Redirecionando para checkout...")}
                  >
                    MATRICULE-SE AGORA
                  </Button>
                </div>
                
                <div className="text-center space-y-4 pt-4 border-t border-white/10">
                  <p className="text-[11px] text-white/40 font-black uppercase tracking-widest">Ou acesse via assinatura</p>
                  <Button variant="link" asChild className="text-gold font-black hover:no-underline text-base p-0 h-auto">
                    <Link to="/conta">CONHECER PLANOS PREMIUM</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : hasAccess && (
            <div className="space-y-6 sticky top-8">
              <Card className="border-none bg-gradient-to-br from-gold/20 to-gold/5 shadow-2xl shadow-gold/5 overflow-hidden rounded-[2rem]">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gold/80">Seu Progresso</h4>
                      <span className="text-4xl font-black text-primary tracking-tighter">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-14 w-14 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-inner">
                      <GraduationCap className="h-7 w-7 text-gold" />
                    </div>
                  </div>
                  <Progress value={progressPercentage} className="h-3 bg-white/50 mb-2 rounded-full" />
                  <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">
                    {completedLessons} DE {totalLessons} AULAS CONCLUÍDAS
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-primary text-white shadow-2xl shadow-primary/20 overflow-hidden rounded-[2rem] relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                <CardContent className="p-8 space-y-6 relative">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                    <Library className="h-7 w-7 text-gold" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold tracking-tight">Biblioteca de Estudos</h4>
                    <p className="text-sm text-white/60 font-medium leading-relaxed">
                      Acesse e-books, apostilas e pontos cantados exclusivos deste curso.
                    </p>
                  </div>
                  <Button asChild size="lg" className="w-full bg-white text-primary hover:bg-gold hover:text-white transition-all duration-300 font-black rounded-xl h-14 shadow-xl">
                    <Link to="/estudos/biblioteca">
                      ACESSAR MATERIAIS
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
