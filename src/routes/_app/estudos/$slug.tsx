import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseBySlug, checkCourseAccess, toggleLessonProgress, getLessonProgress } from "@/lib/courses";
import { ChevronLeft, Clock, Award, BookOpen, Lock, Play, CheckCircle2, Circle, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/estudos/$slug")({
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: course, isLoading } = useQuery({
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

  const toggleMutation = useMutation({
    mutationFn: ({ lessonId, completed }: { lessonId: string; completed: boolean }) => 
      toggleLessonProgress(course!.id, lessonId, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress", course?.id] });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-video w-full rounded-3xl" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Curso não encontrado</h2>
        <Button variant="link" asChild className="mt-4">
          <Link to="/estudos">Voltar para estudos</Link>
        </Button>
      </div>
    );
  }

  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const totalLessons = course.course_lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="space-y-8 pb-20 px-1">
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

      {hasAccess && (
        <Card className="border-gold/20 bg-gold/5 shadow-none overflow-hidden">
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
      )}

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

      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold">Sobre este curso</h2>
        <p className="leading-relaxed text-muted-foreground text-sm">
          {course.description}
        </p>
      </div>

      {!hasAccess && course.price_cents > 0 && (
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Investimento Vitalício</p>
              <h3 className="text-3xl font-bold text-foreground">
                R$ {(course.price_cents / 100).toFixed(2)}
              </h3>
            </div>
            <Button 
              size="lg" 
              className="bg-gold hover:bg-gold/90 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-gold/20"
              onClick={async () => {
                const { supabase } = await import("@/integrations/supabase/client");
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  toast.error("Você precisa estar logado para comprar um curso.");
                  return;
                }
                toast.info("Processando pagamento...");
              }}
            >
              Começar agora
            </Button>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            Acesso liberado imediatamente após a confirmação
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold">Conteúdo do Curso</h2>
        <div className="grid gap-3">
          {course.course_lessons?.sort((a, b) => a.order_index - b.order_index).map((lesson, idx) => {
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
                          Grátis
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
    </div>
  );
}