import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCourseBySlug, checkCourseAccess } from "@/lib/courses";
import { Clock, GraduationCap, Play, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/estudos/$slug")({
  component: CourseDetail,
});

function CourseDetail() {
  const { slug } = Route.useParams();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => getCourseBySlug(slug),
  });

  const { data: hasAccess } = useQuery({
    queryKey: ["course-access", course?.id],
    queryFn: () => (course ? checkCourseAccess(course.id) : false),
    enabled: !!course,
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

  return (
    <div className="space-y-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border">
        <img
          src={course.image_url || "https://images.unsplash.com/photo-1518005020480-388d589d9e22?auto=format&fit=crop&q=80&w=1200"}
          alt={course.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <Badge className="mb-3 bg-gold text-white hover:bg-gold/90 border-none">
            {course.level}
          </Badge>
          <h1 className="font-serif text-3xl font-bold">{course.title}</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gold" />
          <span>{course.duration} de conteúdo</span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-gold" />
          <span>Curso certificado</span>
        </div>
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-gold" />
          <span>{course.course_lessons?.length || 0} aulas</span>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Sobre este curso</h2>
        <p className="leading-relaxed text-muted-foreground">
          {course.description}
        </p>
      </div>

      {!hasAccess && course.price_cents > 0 && (
        <div className="rounded-2xl border border-gold/30 bg-gold/5 p-6 shadow-soft">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Investimento</p>
              <h3 className="text-3xl font-bold text-foreground">
                R$ {(course.price_cents / 100).toFixed(2)}
              </h3>
            </div>
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-white font-bold h-12 px-8">
              Garantir minha vaga
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            Acesso vitalício aos ensinamentos de Pai Joaquim
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Grade curricular</h2>
        <div className="grid gap-3">
          {course.course_lessons?.sort((a, b) => a.order_index - b.order_index).map((lesson, idx) => {
            const isLocked = !hasAccess && !lesson.is_preview;
            return (
              <Link 
                key={lesson.id}
                to="/estudos/$slug/aula/$lessonSlug"
                params={{ slug: course.slug, lessonSlug: lesson.slug }}
                className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                  isLocked ? 'bg-muted/30 opacity-70' : 'bg-card hover:border-gold hover:shadow-soft cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium">{lesson.title}</p>
                    {lesson.is_preview && (
                      <Badge variant="secondary" className="mt-1 text-[10px] h-4">Aula experimental</Badge>
                    )}
                  </div>
                </div>
                {isLocked ? (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gold" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
