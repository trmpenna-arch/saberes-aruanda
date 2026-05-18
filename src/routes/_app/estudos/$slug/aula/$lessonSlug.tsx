import { createFileRoute, Link, Navigate, getRouteApi } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLessonBySlug, getCourseBySlug, checkCourseAccess, toggleLessonProgress, getLessonProgress } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock, CheckCircle2, Circle, Play, Headphones, BookOpen, Volume2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_app/estudos/$slug/aula/$lessonSlug")({
  component: LessonView,
});

const routeApi = getRouteApi("/_app/estudos/$slug/aula/$lessonSlug");

function LessonView() {
  const { slug, lessonSlug } = routeApi.useParams();
  const queryClient = useQueryClient();

  const { data: course, isLoading: loadingCourse } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourseBySlug(slug),
  });

  const { data: lesson, isLoading: loadingLesson } = useQuery({
    queryKey: ["lesson", slug, lessonSlug],
    queryFn: () => getLessonBySlug(slug, lessonSlug),
  });

  const { data: hasAccess, isLoading: loadingAccess } = useQuery({
    queryKey: ["course-access", course?.id],
    queryFn: () => (course ? checkCourseAccess(course.id) : false),
    enabled: !!course,
  });

  const { data: progress } = useQuery({
    queryKey: ["course-progress", course?.id],
    queryFn: () => (course ? getLessonProgress(course.id) : []),
    enabled: !!course && !!hasAccess,
  });

  const isCompleted = progress?.some(p => p.lesson_id === lesson?.id && p.completed);

  const mutation = useMutation({
    mutationFn: (completed: boolean) => 
      toggleLessonProgress(course!.id, lesson!.id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress", course?.id] });
      toast.success(isCompleted ? "Aula marcada como não concluída" : "Aula concluída! Parabéns!");
    },
    onError: () => {
      toast.error("Erro ao salvar progresso.");
    }
  });

  if (loadingCourse || loadingLesson || loadingAccess) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!lesson || !course) {
    return <Navigate to="/estudos" />;
  }

  const isLocked = !hasAccess && !lesson.is_preview;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="rounded-full bg-gold/10 p-4">
          <Lock className="h-10 w-10 text-gold" />
        </div>
        <h2 className="text-2xl font-bold">Conteúdo Restrito</h2>
        <p className="text-muted-foreground max-w-sm">
          Esta aula faz parte do conteúdo avançado. Para ter acesso, por favor adquira o curso ou assine o plano premium.
        </p>
        <Button asChild className="bg-gold hover:bg-gold/90 text-white font-bold">
          <Link to={`/estudos/${course.slug}`}>Ver opções de acesso</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <Link 
          to={`/estudos/${course.slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar para o curso
        </Link>
        
        {hasAccess && (
          <Button 
            variant="outline" 
            size="sm" 
            className={`gap-2 rounded-full border-gold/20 ${isCompleted ? 'bg-green-50 text-green-600 border-green-200' : 'text-gold hover:bg-gold/5'}`}
            onClick={() => mutation.mutate(!isCompleted)}
            disabled={mutation.isPending}
          >
            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {isCompleted ? "Concluída" : "Concluir Aula"}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-serif font-bold">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">{course.title}</p>
      </div>

      {/* Media Players Section */}
      <div className="space-y-6">
        {lesson.video_url && (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg border border-border">
            <iframe
              src={lesson.video_url.includes("youtube.com") || lesson.video_url.includes("youtu.be") 
                ? `https://www.youtube.com/embed/${lesson.video_url.split('v=')[1] || lesson.video_url.split('/').pop()}`
                : lesson.video_url}
              title={lesson.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {lesson.audio_url && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-gold/5 to-gold/10 border border-gold/20 flex flex-col sm:flex-row items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-bold text-sm">Ponto Cantado / Áudio da Aula</h4>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Acompanhe com o som</p>
            </div>
            <audio controls className="w-full sm:w-auto h-8 opacity-90">
              <source src={lesson.audio_url} type="audio/mpeg" />
              Seu navegador não suporta o player de áudio.
            </audio>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="grid gap-6">
        <div className="prose prose-stone max-w-none dark:prose-invert">
          <div className="p-8 rounded-2xl border bg-card/50 shadow-soft">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <BookOpen className="h-5 w-5 text-gold" />
              <h3 className="text-lg font-serif font-semibold">Material de Estudo</h3>
            </div>
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {lesson.content || "Nenhum material de leitura disponível para esta aula."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
