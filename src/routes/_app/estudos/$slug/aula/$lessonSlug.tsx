import { createFileRoute, Link, Navigate, getRouteApi, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLessonBySlug, getCourseBySlug, checkCourseAccess, toggleLessonProgress, getLessonProgress } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  const navigate = useNavigate();
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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-4 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit gap-2 text-white bg-black/20 backdrop-blur-md hover:bg-black/40 transition-colors rounded-full px-4 h-9 z-10 absolute top-4 left-4 border border-white/10"
          onClick={() => navigate({ to: `/estudos/${course.slug}` })}
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        {hasAccess && (
          <div className="absolute top-4 right-4 z-10">
            <Button 
              variant="outline" 
              size="sm" 
              className={`gap-2 rounded-xl font-bold px-4 h-9 border-none shadow-lg ${isCompleted ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-500/20' : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'}`}
              onClick={() => mutation.mutate(!isCompleted)}
              disabled={mutation.isPending}
            >
              {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              {isCompleted ? "Concluída" : "Concluir"}
            </Button>
          </div>
        )}
      </div>


      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight">{lesson.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="outline" className="border-gold/20 text-gold bg-gold/5 font-bold">
            {course.title}
          </Badge>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="font-medium">{lesson.video_url ? "Vídeo Aula" : "Material de Estudo"}</span>
        </div>
      </div>

      {/* Media Players Section */}
      <div className="grid gap-8">
        {lesson.video_url && (
          <div className="aspect-video w-full overflow-hidden rounded-b-3xl bg-black shadow-2xl relative group -mx-5 md:mx-0 md:rounded-3xl">
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
          <Card className="overflow-hidden border-gold/20 bg-gradient-to-br from-gold/5 to-transparent shadow-soft rounded-3xl">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-gold flex items-center justify-center text-white shadow-lg shadow-gold/20 shrink-0">
                <Volume2 className="h-8 w-8" />
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h4 className="font-serif text-xl font-bold">Ponto Cantado</h4>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Acompanhe a instrução sonora</p>
              </div>
              <div className="w-full md:w-auto min-w-[300px]">
                <audio controls className="w-full custom-audio-player h-10">
                  <source src={lesson.audio_url} type="audio/mpeg" />
                  Seu navegador não suporta o player de áudio.
                </audio>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-none">
        <div className="p-8 md:p-12 rounded-3xl border bg-card/30 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold/30" />
          <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
            <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-gold" />
            </div>
            <h3 className="text-xl font-serif font-bold">Conteúdo da Aula</h3>
          </div>
          <div className="prose prose-stone max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:text-muted-foreground prose-headings:font-serif">
            <div className="whitespace-pre-wrap text-base md:text-lg">
              {lesson.content || "Nenhum material de leitura disponível para esta aula."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
