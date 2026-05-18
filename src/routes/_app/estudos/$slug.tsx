import { createFileRoute, Link, useNavigate, getRouteApi } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourseBySlug, checkCourseAccess, toggleLessonProgress, getLessonProgress } from "@/lib/courses";
import { ChevronLeft, Clock, Award, BookOpen, Lock, Play, CheckCircle2, Circle, GraduationCap, Flame, Star, Waves, Users, Church, HelpCircle, Library, ClipboardList, ShieldCheck, Leaf, Music, Wind, Sparkles, Heart } from "lucide-react";
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
      <div className="relative min-h-[350px] md:min-h-[450px] w-full overflow-hidden rounded-[2.5rem] shadow-2xl bg-black group/hero">
        <img
          src={course.image_url || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=1600"}
          alt={course.title}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-[2s] group-hover/hero:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="absolute top-6 left-6 z-20">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white/10 backdrop-blur-xl text-white hover:bg-gold hover:text-black border border-white/10 transition-all duration-300" 
            onClick={() => navigate({ to: "/estudos" })}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12">
          <div className="max-w-3xl space-y-4 md:space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gold text-black hover:bg-gold/90 border-none px-3 py-0.5 md:px-4 md:py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-gold/20">
                {course.level}
              </Badge>
              {course.category && (
                <Badge variant="outline" className="border-white/30 text-white px-3 py-0.5 md:px-4 md:py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md">
                  {course.category}
                </Badge>
              )}
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.1] md:leading-[0.9] drop-shadow-2xl text-white tracking-tighter">
              {course.title}
            </h1>
            
            <p className="text-sm md:text-lg lg:text-xl text-white/70 font-medium line-clamp-2 max-w-xl leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-8 pt-2 md:pt-4 text-[9px] md:text-[11px] font-black text-white/90 uppercase tracking-[0.1em] md:tracking-[0.2em]">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                </div>
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                </div>
                <span>{totalLessons} AULAS</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30">
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-gold" />
                </div>
                <span>CERTIFICADO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-soft overflow-hidden rounded-[2.5rem]">
            <CardContent className="p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">Propósito do Estudo</h2>
              </div>
              <p className="leading-relaxed text-muted-foreground text-xl font-medium max-w-none">
                {course.description}
              </p>
            </CardContent>
          </Card>
          
          {/* Learning Section (Specific for Cambone) */}
          {(slug === 'cambone-a-base-do-terreiro' || slug === 'cambone-o-pilar-do-terreiro') && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 px-2">
                <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Star className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">O que você vai aprender</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Atribuições", desc: "Quais as funções práticas do Cambone no terreiro.", icon: ClipboardList },
                  { title: "Postura e Ética", desc: "O comportamento e a discrição necessários na função.", icon: ShieldCheck },
                  { title: "Ervas e Banhos", desc: "Manipulação básica de ervas e preparo de banhos.", icon: Leaf },
                  { title: "Velas e Firmezas", desc: "Fundamentos sobre o uso de velas e firmezas simples.", icon: Flame },
                  { title: "Pontos Cantados", desc: "Como auxiliar na curimba e o papel dos pontos.", icon: Music },
                  { title: "Defumação", desc: "O preparo e a condução da defumação no início dos trabalhos.", icon: Wind },
                ].map((item, i) => (
                  <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-sm hover:border-gold/60 hover:shadow-gold transition-all duration-500 rounded-[2.5rem] overflow-hidden group">
                    <CardContent className="p-8 space-y-4">
                      <div className="h-14 w-14 rounded-[1.25rem] bg-gold/10 flex items-center justify-center mb-2 group-hover:bg-gold transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <item.icon className="h-7 w-7 text-gold group-hover:text-white transition-colors duration-500" />
                      </div>
                      <h3 className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}


          {/* Target Audience Section (Specific for Cambone) */}
          {slug === 'cambone-o-pilar-do-terreiro' && (
            <div className="space-y-10">
              <div className="flex items-center gap-4 px-2">
                <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">Para quem é o Curso</h2>
              </div>
              
              <div className="grid gap-6">
                {[
                  { title: "Médiuns Iniciantes", desc: "Para quem está começando sua jornada e deseja servir como o braço direito das entidades.", icon: Sparkles },
                  { title: "Cambones em Atividade", desc: "Para quem já exerce a função e busca aprimorar seus conhecimentos e postura ética.", icon: ShieldCheck },
                  { title: "Dirigentes de Terreiro", desc: "Para quem deseja padronizar o conhecimento de seus auxiliares com base em fundamentos sólidos.", icon: GraduationCap },
                  { title: "Buscadores da Verdade", desc: "Para todos que desejam compreender o papel vital do Cambone na sustentação do terreiro.", icon: Heart },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="group flex items-center gap-6 p-8 rounded-[2.5rem] border bg-card border-border/40 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
                  >
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Audience Section (Specific for Teologia) */}
          {slug === 'teologia-da-umbanda' && (
            <div className="space-y-10">
              <div className="flex items-center gap-4 px-2">
                <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">Para quem é a Nova Teologia da Umbanda</h2>
              </div>
              
              <div className="grid gap-6">
                {[
                  { title: "Praticantes de Umbanda", desc: "Para quem já pratica e busca se aprofundar nos fundamentos e mistérios da religião.", icon: Sparkles },
                  { title: "Médiuns em Desenvolvimento", desc: "Para quem já frequenta e busca aprofundar o entendimento doutrinário.", icon: Flame },
                  { title: "Simpatizantes e Frequentadores", desc: "Quem admira, frequenta ou sente o chamado da Umbanda, mas ainda se sente inseguro ou tem dúvidas.", icon: BookOpen },
                  { title: "Sacerdotes e Dirigentes", desc: "Sacerdotes ou dirigentes que buscam embasamento sólido para seus trabalhos na Umbanda.", icon: Heart },
                  { title: "Busca por Clareza", desc: "Pessoas que já passaram por outros cursos e querem uma abordagem mais atual, sem misticismo exagerado e com base na vivência real dos terreiros.", icon: ShieldCheck },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="group flex items-center gap-6 p-8 rounded-[2.5rem] border bg-card border-border/40 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
                  >
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Target Audience Section (Specific for Umbanda para Iniciantes) */}
          {slug === 'umbanda-para-iniciantes' && (
            <div className="space-y-10">
              <div className="flex items-center gap-4 px-2">
                <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">Para quem é o Curso</h2>
              </div>
              
              <div className="grid gap-6">
                {[
                  { title: "Curiosos", desc: "Que precisam entender porque fazem o que fazem durante os rituais e trabalhos espirituais da Umbanda.", icon: HelpCircle },
                  { title: "Iniciantes", desc: "Que desejam entender saudações, cores, sons, divindades, espíritos, atendimento, hierarquia e o significado de cada momento da gira.", icon: Sparkles },
                  { title: "Umbandistas", desc: "Que desejam saber sobre os detalhes do ritual de Umbanda e porque a religião se organiza dessa forma.", icon: ShieldCheck },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className="group flex items-center gap-6 p-8 rounded-[2.5rem] border bg-card border-border/40 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
                  >
                    <div className="h-16 w-16 shrink-0 rounded-2xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500">
                      <item.icon className="h-8 w-8" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curriculum Section */}
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                  <GraduationCap className="h-6 w-6 text-gold" />
                </div>
                <h2 className="font-serif text-4xl font-bold tracking-tight">Grade Curricular</h2>
              </div>
              {hasAccess && (
                <Card className="border-none bg-gold/5 backdrop-blur-sm px-6 py-4 flex items-center gap-6 rounded-2xl border border-gold/10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">Seu Progresso Atual</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 w-32 md:w-48 bg-gold/20 rounded-full" />
                </Card>
              )}
            </div>

            {slug === 'umbanda-para-iniciantes' && (
              <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-soft overflow-hidden rounded-[2.5rem] mb-12">
                <CardContent className="p-8 md:p-10 space-y-6">
                  <p className="leading-relaxed text-muted-foreground text-lg font-medium">
                    Estudo criado de acordo com as sensações e dúvidas que uma pessoa (iniciante ou não) vai tendo ao adentrar um terreiro, viver a ritualística e se envolver com a Umbanda.
                  </p>
                  <p className="leading-relaxed text-muted-foreground text-lg font-medium">
                    Princípios básicos da religião que na maioria das vezes não são explicados na prática cotidiana é objeto de inúmeras dúvidas para quem frequenta um terreiro.
                  </p>
                  <div className="bg-gold/5 border-l-4 border-gold p-6 rounded-r-2xl italic text-primary font-serif text-xl">
                    "Por que batemos cabeça? Por que viramos as costas para saudar Exu? O que é o Congá? Por que toca sineta? Por que usa-se branco? Com cortina ou sem cortina?"
                  </div>
                  <p className="leading-relaxed text-muted-foreground text-lg font-medium">
                    Todos nossos ritos e ações desencadeiam um processo magístico que se conecta e reverbera no plano espiritual.
                  </p>
                  <p className="leading-relaxed text-muted-foreground text-lg font-medium">
                    Nos comunicamos também, por meio de nossa ritualística. Entenda o significado de tudo no curso <span className="text-primary font-bold">Umbanda para Iniciantes</span>.
                  </p>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-12">
              {modules.map((moduleName, modIdx) => {
                const moduleLessons = lessonsWithModules.filter(l => l.module === moduleName);
                const moduleCompleted = moduleLessons.filter(l => progress?.some(p => p.lesson_id === l.id && p.completed)).length;
                const modulePercentage = (moduleCompleted / moduleLessons.length) * 100;

                return (
                  <div key={moduleName} className="space-y-8">
                    <div className="flex flex-col gap-3 px-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-[16px] font-black text-white shadow-xl shadow-gold/30 group-hover:rotate-12 transition-transform">
                            {modIdx + 1}
                          </span>
                          <h3 className="font-serif text-3xl font-bold text-primary tracking-tight">
                            {moduleName}
                          </h3>
                        </div>
                        {hasAccess && (
                          <Badge variant="outline" className="border-gold/20 text-gold font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-gold/5">
                            {moduleCompleted}/{moduleLessons.length} AULAS
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid gap-6">
                      {moduleLessons.map((lesson, idx) => {
                        const isCompleted = progress?.some(p => p.lesson_id === lesson.id && p.completed);
                        const isLocked = !hasAccess;
                        
                        return (
                          <div 
                            key={lesson.id}
                            className={`group flex items-center justify-between gap-4 p-8 rounded-[2.5rem] border transition-all duration-500 ${
                              isLocked 
                                ? "bg-muted/10 border-border/20 opacity-70 grayscale cursor-not-allowed" 
                                : "bg-card border-border/40 hover:border-gold/60 hover:shadow-2xl hover:shadow-gold/10 active:scale-[0.99] hover:-translate-y-1"
                            }`}
                          >
                            <div className="flex items-center gap-6 flex-1 min-w-0">
                              <div className={`h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center font-black transition-all duration-700 ${
                                isCompleted 
                                  ? "bg-green-500 text-white shadow-2xl shadow-green-500/30 rotate-[360deg]" 
                                  : "bg-muted text-muted-foreground group-hover:bg-gold/20 group-hover:text-gold border border-border/50 group-hover:border-gold/30"
                              }`}>
                                {isCompleted ? <CheckCircle2 className="h-8 w-8" /> : (
                                  <span className="text-xl">{idx + 1}</span>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <h3 className={`font-bold text-xl md:text-2xl truncate tracking-tight transition-colors ${isLocked ? "text-muted-foreground" : "text-foreground group-hover:text-primary"}`}>
                                  {lesson.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="secondary" className="bg-muted/50 text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-md flex items-center gap-1.5">
                                    {lesson.video_url ? <Play className="h-3 w-3 text-gold fill-current" /> : <BookOpen className="h-3 w-3 text-gold" />}
                                    {lesson.video_url ? "Vídeo Aula" : "Material de Apoio"}
                                  </Badge>
                                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Acesso Anual</span>
                                </div>
                              </div>
                            </div>
                            
                            {isLocked ? (
                              <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/20">
                                <Lock className="h-6 w-6 text-muted-foreground/40" />
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-16 w-16 rounded-2xl bg-gold/10 text-gold hover:bg-gold hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-gold/30"
                                onClick={() => navigate({ to: `/estudos/${slug}/aula/${lesson.slug}` })}
                              >
                                <Play className="h-8 w-8 fill-current ml-1" />
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
            <Card className="border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden sticky top-8 rounded-[2rem]">
              <div className="bg-primary px-8 py-6 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1 block">Inscrição Anual</span>
                <CardTitle className="font-serif text-3xl font-bold text-white">
                  Acesso Anual
                </CardTitle>
              </div>

              <CardContent className="p-8 space-y-8">
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <span className="text-xl font-bold self-start mt-2">R$</span>
                    <span className="text-7xl font-black tracking-tighter leading-none">
                      {(course.price_cents / 100).toFixed(0)}
                    </span>
                    <div className="flex flex-col items-start self-center">
                      <span className="text-xl font-bold leading-none">,{(course.price_cents % 100).toString().padStart(2, '0')}</span>
                      <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider">à vista</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 border-y border-border/40 py-8">
                  {[
                    { text: "Certificado de Conclusão", icon: Award },
                    { text: "Acesso por 1 Ano", icon: ShieldCheck },
                    { text: "Materiais Didáticos", icon: Library },
                    { text: "Suporte ao Aluno", icon: HelpCircle }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 border border-green-100">
                        <benefit.icon className="h-3.5 w-3.5 text-green-600" />
                      </div>
                      <p className="text-sm text-foreground/80 font-medium">{benefit.text}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full h-16 bg-primary text-primary-foreground hover:bg-primary/90 font-black text-lg rounded-xl shadow-xl shadow-primary/10 transition-all uppercase tracking-tight whitespace-normal px-4 py-2 text-center flex items-center justify-center leading-tight"
                    onClick={() => toast.info("Redirecionando para checkout...")}
                  >
                    Fazer minha matrícula
                  </Button>
                  
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">OU</p>
                  
                  <Button variant="outline" asChild className="w-full h-14 border-gold/40 text-gold bg-gold/5 hover:bg-gold hover:text-white font-black rounded-xl transition-all whitespace-normal px-4 py-2 text-center flex items-center justify-center leading-tight">
                    <Link to="/assinatura">Assinar Todos os Cursos</Link>
                  </Button>
                </div>
              </CardContent>
              
              <div className="bg-muted/30 p-4 text-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center justify-center gap-2">
                  <ShieldCheck className="h-3 w-3" /> Transação Criptografada
                </span>
              </div>
            </Card>
          ) : hasAccess && (
            <div className="space-y-6 sticky top-8">
              <Card className="border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-gold/5 overflow-hidden rounded-[2.5rem] border border-gold/10">
                <CardContent className="p-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gold/80">Jornada de Estudo</h4>
                      <span className="text-5xl font-black text-primary tracking-tighter leading-none">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-16 w-16 rounded-[1.25rem] bg-gold/10 flex items-center justify-center shadow-inner border border-gold/20">
                      <GraduationCap className="h-8 w-8 text-gold" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress value={progressPercentage} className="h-3 bg-gold/10 rounded-full" />
                    <p className="text-[11px] text-muted-foreground/60 font-black uppercase tracking-[0.2em] text-center">
                      {completedLessons} DE {totalLessons} AULAS CONCLUÍDAS
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-primary text-white shadow-2xl shadow-primary/30 overflow-hidden rounded-[2.5rem] relative group/lib transition-transform hover:-translate-y-1 duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-opacity group-hover/lib:opacity-100 opacity-50" />
                <CardContent className="p-10 space-y-8 relative">
                  <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 group-hover/lib:bg-gold transition-colors duration-500">
                    <Library className="h-8 w-8 text-gold group-hover:text-black transition-colors" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-bold tracking-tighter leading-tight">Biblioteca do Terreiro</h4>
                    <p className="text-base text-white/70 font-medium leading-relaxed">
                      Material complementar, e-books e pontos cantados selecionados para aprofundar seu conhecimento.
                    </p>
                  </div>
                  <Button asChild size="lg" className="w-full bg-gold text-black hover:bg-white transition-all duration-500 font-black rounded-2xl h-16 shadow-2xl shadow-gold/20 text-lg tracking-tight uppercase">
                    <Link to="/estudos/biblioteca">
                      ACESSAR BIBLIOTECA
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
