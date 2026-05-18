import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getCourses } from "@/lib/courses";
import { GraduationCap, Clock, Award, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/estudos/")({
  component: CursosIndex,
});

function CursosIndex() {
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-bold text-foreground">Escola de Aruanda</h1>
        <p className="text-muted-foreground">Aprofunde seu conhecimento com nossos cursos guiados.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="space-y-2">
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
      ) : courses?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-medium">Novos cursos em breve</h3>
          <p className="text-sm text-muted-foreground">Pai Joaquim está preparando ensinamentos profundos para você.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {courses?.map((course) => (
            <Link key={course.id} to={`/cursos/${course.slug}`}>
              <Card className="h-full overflow-hidden transition-all hover:border-gold hover:shadow-soft">
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={course.image_url || "https://images.unsplash.com/photo-1518005020480-388d589d9e22?auto=format&fit=crop&q=80&w=800"}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-gold border-gold/30">
                      {course.level}
                    </Badge>
                    <span className="text-sm font-medium text-primary">
                      {course.price_cents === 0 ? "Gratuito" : `R$ ${(course.price_cents / 100).toFixed(2)}`}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-bold leading-tight">{course.title}</h3>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {course.description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 p-4 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>Certificado</span>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-gold" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
