import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { orixas, estudos } from "@/data/content";
import { getContentSettings, updateContentSetting, uploadContentImage } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Image as ImageIcon, Upload } from "lucide-react";

export const Route = createFileRoute("/_app/conta")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getContentSettings();
      setSettings(data);
    } catch (error) {
      console.error("Error loading settings:", error);
      toast.error("Erro ao carregar configurações: Não foi possível buscar as imagens do banco.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (type: string, slug: string, imageUrl: string) => {
    const id = `${type}-${slug}`;
    setSaving(id);
    try {
      await updateContentSetting(type, slug, imageUrl);
      toast.success("Imagem atualizada com sucesso.");
      await loadSettings();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Erro ao salvar: " + (error.message || "Ocorreu um erro inesperado."));
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <header className="text-center">
        <h1 className="font-serif text-3xl font-bold">Painel de Conteúdo</h1>
        <p className="text-sm text-muted-foreground">Gerencie as imagens dos Orixás e Estudos</p>
      </header>

      <Tabs defaultValue="orixas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orixas">Orixás</TabsTrigger>
          <TabsTrigger value="estudos">Estudos</TabsTrigger>
        </TabsList>

        <TabsContent value="orixas" className="mt-6 space-y-4">
          {orixas.map((orixa) => (
            <ContentCard
              key={orixa.slug}
              title={orixa.nome}
              slug={orixa.slug}
              type="orixa"
              defaultImage={orixa.imageUrl}
              currentImage={settings.find(s => s.type === 'orixa' && s.slug === orixa.slug)?.image_url}
              onSave={handleSave}
              isSaving={saving === `orixa-${orixa.slug}`}
            />
          ))}
        </TabsContent>

        <TabsContent value="estudos" className="mt-6 space-y-4">
          {estudos.map((estudo) => (
            <ContentCard
              key={estudo.slug}
              title={estudo.titulo}
              slug={estudo.slug}
              type="estudo"
              defaultImage="" // Estudos usually don't have images in data/content.ts yet
              currentImage={settings.find(s => s.type === 'estudo' && s.slug === estudo.slug)?.image_url}
              onSave={handleSave}
              isSaving={saving === `estudo-${estudo.slug}`}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentCard({ title, slug, type, defaultImage, currentImage, onSave, isSaving }: any) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (currentImage || defaultImage) {
      setUrl(currentImage || defaultImage || "");
    }
  }, [currentImage, defaultImage]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
            {url ? (
              <img src={url} alt={title} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">URL da Imagem</label>
              <Input
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button
              className="w-full sm:w-auto"
              disabled={isSaving}
              onClick={() => onSave(type, slug, url)}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Alteração
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
