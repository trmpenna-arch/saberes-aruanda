import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Newspaper, FileText, Trash2, Save, Image as ImageIcon, Upload, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";

export function NewsManager() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    pdf_url: "",
    published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const loadNews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      toast.error("Erro ao carregar notícias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'image') setUploadingImage(true);
    else setUploadingPdf(true);

    try {
      const bucket = type === 'image' ? 'news-images' : 'news-pdfs';
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        [type === 'image' ? 'image_url' : 'pdf_url']: publicUrl
      }));
      
      toast.success(`${type === 'image' ? 'Imagem' : 'PDF'} enviado com sucesso!`);
    } catch (error: any) {
      toast.error(`Erro no upload: ${error.message}`);
    } finally {
      if (type === 'image') setUploadingImage(false);
      else setUploadingPdf(false);
    }
  };

  const handleSaveNews = async () => {
    try {
      if (!formData.title) {
        toast.error("O título é obrigatório");
        return;
      }

      const payload = {
        ...formData,
        published_at: new Date(formData.published_at).toISOString(),
      };

      if (selectedNews) {
        const { error } = await supabase
          .from("news")
          .update(payload)
          .eq("id", selectedNews.id);
        if (error) throw error;
        toast.success("Notícia atualizada!");
      } else {
        const { error } = await supabase
          .from("news")
          .insert([payload]);
        if (error) throw error;
        toast.success("Notícia criada!");
      }
      
      setNewsDialogOpen(false);
      loadNews();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta notícia?")) return;
    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      toast.success("Notícia excluída");
      loadNews();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          Gerenciar News TU.ZEB
        </h2>
        <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedNews(null);
              setFormData({
                title: "",
                content: "",
                image_url: "",
                pdf_url: "",
                published_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
              });
            }}>
              <Plus className="h-4 w-4 mr-2" /> Nova Notícia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedNews ? "Editar Notícia" : "Nova Notícia"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Título da notícia"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Data de Publicação</Label>
                <Input 
                  type="datetime-local"
                  value={formData.published_at} 
                  onChange={e => setFormData({...formData, published_at: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <Label>Conteúdo (opcional)</Label>
                <Textarea 
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  placeholder="Texto da notícia..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Imagem (Capa)</Label>
                  <div className="flex flex-col gap-2">
                    {formData.image_url && (
                      <img src={formData.image_url} className="h-24 w-full object-cover rounded border" alt="Preview" />
                    )}
                    <div className="flex gap-2">
                      <Input 
                        placeholder="URL da imagem" 
                        value={formData.image_url}
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center h-10 w-10 border rounded hover:bg-muted">
                          {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </div>
                      </Label>
                      <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'image')} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Documento PDF</Label>
                  <div className="flex flex-col gap-2">
                    {formData.pdf_url && (
                      <div className="flex items-center gap-2 p-2 border rounded text-xs bg-muted">
                        <FileText className="h-4 w-4" />
                        PDF Anexado
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input 
                        placeholder="URL do PDF" 
                        value={formData.pdf_url}
                        onChange={e => setFormData({...formData, pdf_url: e.target.value})}
                      />
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center h-10 w-10 border rounded hover:bg-muted">
                          {uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        </div>
                      </Label>
                      <input id="pdf-upload" type="file" accept="application/pdf" className="hidden" onChange={e => handleFileUpload(e, 'pdf')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveNews}>Salvar Notícia</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {news.map(item => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-muted overflow-hidden">
                    {item.image_url && <img src={item.image_url} className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(item.published_at), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedNews(item);
                    setFormData({
                      title: item.title,
                      content: item.content || "",
                      image_url: item.image_url || "",
                      pdf_url: item.pdf_url || "",
                      published_at: format(new Date(item.published_at), "yyyy-MM-dd'T'HH:mm"),
                    });
                    setNewsDialogOpen(true);
                  }}>Editar</Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteNews(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}

          {news.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Nenhuma notícia cadastrada.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
