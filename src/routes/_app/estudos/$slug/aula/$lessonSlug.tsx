import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getLessonBySlug, getCourseBySlug, checkCourseAccess } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Lock } from "lucide-react";
import { Link, Navigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/estudos/$slug/aula/$lessonSlug")({
  component: LessonView,
});

function LessonView() {
  const { slug, lessonSlug } = Route.useParams();

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
          Esta aula faz parte do curso pago. Para ter acesso, por favor adquira o curso completo.
        </p>
        <Button asChild className="bg-gold hover:bg-gold/90 text-white font-bold">
          <Link to={`/estudos/${course.slug}`}>Ver curso completo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link 
        to={`/estudos/${course.slug}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar para o curso
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-serif font-bold">{lesson.title}</h1>
        <p className="text-sm text-muted-foreground">{course.title}</p>
      </div>

      {lesson.video_url ? (
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
          {/* Implementação simples de embed para exemplo */}
          <iframe
            src={lesson.video_url.replace("watch?v=", "embed/")}
            title={lesson.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-2xl bg-muted/30 flex items-center justify-center">
          <p className="text-muted-foreground italic">Sem vídeo para esta aula</p>
        </div>
      )}

      <div className="prose prose-stone max-w-none dark:prose-invert">
        <div className="p-6 rounded-2xl border bg-card/50">
          <h3 className="text-lg font-serif font-semibold mb-4">Material de Estudo</h3>
          <div className="whitespace-pre-wrap text-muted-foreground">
            {lesson.content || "Nenhum material de leitura disponível para esta aula."}
          </div>
        </div>
      </div>
    </div>
  );
}
