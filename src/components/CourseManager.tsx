import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, GraduationCap, Video, FileText, Trash2, MoreVertical, Save } from "lucide-react";
import { getAllCoursesAdmin, createCourse, updateCourse, deleteCourse, createLesson, updateLesson, deleteLesson } from "@/lib/courses";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CourseManager() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price_cents: 0,
    level: "Iniciante",
    category: "Geral",
    duration: "",
    image_url: "",
    is_published: false
  });
  const [lessonData, setLessonData] = useState({
    title: "",
    slug: "",
    content: "",
    video_url: "",
    order_index: 0,
    is_preview: false
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await getAllCoursesAdmin();
      // Fetch lessons for each course
      const coursesWithLessons = await Promise.all(data.map(async (course: any) => {
        const { data: lessons } = await supabase
          .from("course_lessons")
          .select("*")
          .eq("course_id", course.id)
          .order("order_index", { ascending: true });
        return { ...course, lessons: lessons || [] };
      }));
      setCourses(coursesWithLessons);
    } catch (error) {
      toast.error("Erro ao carregar cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSaveCourse = async () => {
    try {
      if (selectedCourse) {
        await updateCourse(selectedCourse.id, formData);
        toast.success("Curso atualizado!");
      } else {
        await createCourse(formData);
        toast.success("Curso criado!");
      }
      setCourseDialogOpen(false);
      loadCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaveLesson = async () => {
    try {
      if (selectedLesson) {
        await updateLesson(selectedLesson.id, lessonData);
        toast.success("Aula atualizada!");
      } else {
        await createLesson({ ...lessonData, course_id: selectedCourse.id });
        toast.success("Aula adicionada!");
      }
      setLessonDialogOpen(false);
      loadCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Deseja realmente excluir este curso e todas as suas aulas?")) return;
    try {
      await deleteCourse(id);
      toast.success("Curso excluído");
      loadCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm("Deseja excluir esta aula?")) return;
    try {
      await deleteLesson(id);
      toast.success("Aula excluída");
      loadCourses();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Gerenciar Cursos
        </h2>
        <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedCourse(null);
              setFormData({
                title: "", slug: "", description: "", price_cents: 0,
                level: "Iniciante", category: "Geral", duration: "", image_url: "", is_published: false
              });
            }}>
              <Plus className="h-4 w-4 mr-2" /> Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedCourse ? "Editar Curso" : "Novo Curso"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Descrição</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Preço (centavos)</Label>
                <Input type="number" value={formData.price_cents} onChange={e => setFormData({...formData, price_cents: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Duração</Label>
                <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Iniciante, Fundamentos..." />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>URL da Imagem</Label>
                <Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
              </div>
              <div className="flex items-center gap-2">
                <Switch id="published" checked={formData.is_published} onCheckedChange={val => setFormData({...formData, is_published: val})} />
                <Label htmlFor="published">Publicado</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveCourse}>Salvar Curso</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <Card key={course.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                    {course.image_url && <img src={course.image_url} className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]">{course.level}</Badge>
                      <Badge variant={course.is_published ? "default" : "secondary"} className="text-[10px]">
                        {course.is_published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedCourse(course);
                    setFormData(course);
                    setCourseDialogOpen(true);
                  }}>Editar</Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="lessons">
                    <AccordionTrigger className="text-sm py-2">
                      Aulas ({course.lessons?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {course.lessons?.map((lesson: any) => (
                          <div key={lesson.id} className="flex items-center justify-between p-2 rounded border bg-muted/30">
                            <div className="flex items-center gap-3">
                              {lesson.video_url ? <Video className="h-4 w-4 text-gold" /> : <FileText className="h-4 w-4 text-muted-foreground" />}
                              <span className="text-sm font-medium">{lesson.title}</span>
                              {lesson.is_preview && <Badge className="bg-green-500/10 text-green-500 border-none text-[9px] h-4">Preview</Badge>}
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
                                setSelectedCourse(course);
                                setSelectedLesson(lesson);
                                setLessonData(lesson);
                                setLessonDialogOpen(true);
                              }}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteLesson(lesson.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="w-full border-dashed border mt-2" onClick={() => {
                          setSelectedCourse(course);
                          setSelectedLesson(null);
                          setLessonData({ title: "", slug: "", content: "", video_url: "", order_index: course.lessons.length + 1, is_preview: false });
                          setLessonDialogOpen(true);
                        }}>
                          <Plus className="h-3 w-3 mr-2" /> Adicionar Aula
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedLesson ? "Editar Aula" : "Nova Aula"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={lessonData.title} onChange={e => setLessonData({...lessonData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input value={lessonData.slug} onChange={e => setLessonData({...lessonData, slug: e.target.value})} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>URL do Vídeo</Label>
              <Input value={lessonData.video_url} onChange={e => setLessonData({...lessonData, video_url: e.target.value})} placeholder="https://youtube.com/..." />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Conteúdo da Aula (Texto)</Label>
              <Textarea className="h-40" value={lessonData.content} onChange={e => setLessonData({...lessonData, content: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input type="number" value={lessonData.order_index} onChange={e => setLessonData({...lessonData, order_index: parseInt(e.target.value)})} />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <Switch id="lesson-preview" checked={lessonData.is_preview} onCheckedChange={val => setLessonData({...lessonData, is_preview: val})} />
              <Label htmlFor="lesson-preview">Aula Gratuita (Preview)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveLesson}>Salvar Aula</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
