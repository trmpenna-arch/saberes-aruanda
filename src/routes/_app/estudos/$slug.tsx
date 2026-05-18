import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseBySlug, checkCourseAccess, toggleLessonProgress, getLessonProgress } from "@/lib/courses";
import { ChevronLeft, Clock, Award, BookOpen, Lock, Play, CheckCircle2, Circle, GraduationCap, Flame, Star, Waves, Users, Church, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  if (isLoading) {
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

  if (courseError || !course) {
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

  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const totalLessons = course.course_lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

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
              Garantir minha vaga
            </Button>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            Acesso liberado imediatamente após a confirmação
          </p>
        </div>
      ) : hasAccess && (
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

      {/* CUSTOM PREVIEW FOR TEOLOGIA */}
      {!hasAccess && isTeologia && (
        <div className="space-y-12 animate-in fade-in duration-700">
          {/* Target Audience */}
          <section className="space-y-6">
            <h2 className="text-center font-serif text-2xl font-bold text-primary">Para quem é a Nova Teologia de Umbanda</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                "Pessoas que praticam a Umbanda e querem se aprofundar nos fundamentos.",
                "Médiuns em desenvolvimento ou já atuantes que desejam mais clareza.",
                "Quem admira, frequenta ou sente o chamado da Umbanda mas tem dúvidas.",
                "Sacerdotes ou dirigentes que buscam embasamento sólido.",
                "Pessoas que querem uma abordagem atual, sem misticismo exagerado."
              ].map((text, i) => (
                <div key={i} className="flex flex-col items-center gap-3 rounded-xl border border-gold/10 bg-card p-4 text-center shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Inspirational Quote */}
          <div className="rounded-2xl bg-primary px-8 py-10 text-center text-white shadow-xl">
            <p className="font-serif text-xl italic leading-relaxed">
              "Mais do que decorar explicações, o curso convida o aluno a refletir, questionar e entender a Umbanda como um sistema religioso legítimo, profundo e completo."
            </p>
          </div>

          {/* Course Path Statement */}
          <section className="space-y-4 text-center">
            <h2 className="font-serif text-2xl font-bold text-primary leading-tight">
              Existe um caminho de estudos que te ajuda a <span className="text-gold">viver sua fé com segurança</span>, clareza e conexão.
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Chega de tentar "adivinhar" o que acontece nos rituais. Baseado na vivência real, pensamos a religião como um caminho de consciência pra vida.
            </p>
          </section>

          {/* Modules Grid */}
          <section className="space-y-6">
            <h2 className="text-center font-serif text-2xl font-bold text-primary">Conteúdo Programático</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { m: "01", t: "Terreiro e Ritual", d: "Estrutura, gira, cargos e vestimentas.", icon: Church },
                { m: "02", t: "Mediunidade na Umbanda", d: "Incorporação, tipos e firmeza da coroa.", icon: Star },
                { m: "03", t: "Rituais e Magias", d: "Firmezas, oferendas, pontos riscados e ervas.", icon: Flame },
                { m: "04", t: "Origens da Umbanda", d: "Raízes: Calundu, Macumba, Candomblé e Sincretismos.", icon: Users },
                { m: "05", t: "Povos de Umbanda", d: "Caboclos, Pretos Velhos, Ciganos, Exus e todos os guias.", icon: Users },
                { m: "06", t: "Orixás e Forças da Natureza", d: "Culto, oferendas e conexão espiritual.", icon: Waves },
                { m: "07", t: "No que a Umbanda acredita?", d: "Reencarnação, ética e espiritualidade com consciência.", icon: Star },
                { m: "08", t: "Sacerdócio e Ética", d: "Gestão de terreiro e liderança comunitária.", icon: Award },
                { m: "09", t: "Convidados e Complementos", d: "Aulas especiais com mestres e referências da religião.", icon: Users },
              ].map((mod, i) => (
                <div key={i} className="group relative rounded-xl border border-border bg-card p-6 transition-all hover:border-gold/50 hover:shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Módulo {mod.m}</span>
                    <mod.icon className="h-5 w-5 text-gold/40 group-hover:text-gold transition-colors" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-bold text-primary uppercase leading-tight">{mod.t}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{mod.d}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Standard Course Info (if not Teologia or already has access) */}
      {(!isTeologia || hasAccess) && (
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold">Sobre este curso</h2>
          <p className="leading-relaxed text-muted-foreground text-sm">
            {course.description}
          </p>
        </div>
      )}

      {/* Curriculum Grid */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold">Grade curricular</h2>
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