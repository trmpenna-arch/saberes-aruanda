import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { orixas, estudos, esquerda, entidades } from "@/data/content";
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
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'trmpenna@gmail.com') {
        toast.error("Acesso negado. Apenas o administrador pode acessar esta página.");
        navigate({ to: "/" });
        return;
      }
      setIsAdmin(true);
      await loadSettings();
    } catch (error) {
      console.error("Error checking admin:", error);
      navigate({ to: "/" });
    }
  };

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

  if (loading || !isAdmin) {
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
        <p className="text-sm text-muted-foreground">Gerencie as imagens dos Orixás, Estudos, Esquerda e Entidades</p>
      </header>

      <Tabs defaultValue="orixas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orixas">Orixás</TabsTrigger>
          <TabsTrigger value="estudos">Estudos</TabsTrigger>
          <TabsTrigger value="esquerda">Esquerda</TabsTrigger>
          <TabsTrigger value="entidades">Entidades</TabsTrigger>
          <TabsTrigger value="site">Site</TabsTrigger>
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

        <TabsContent value="esquerda" className="mt-6 space-y-4">
          {esquerda.map((item) => (
            <ContentCard
              key={item.slug}
              title={item.nome}
              slug={item.slug}
              type="esquerda"
              defaultImage={item.imageUrl}
              currentImage={settings.find(s => s.type === 'esquerda' && s.slug === item.slug)?.image_url}
              onSave={handleSave}
              isSaving={saving === `esquerda-${item.slug}`}
            />
          ))}
        </TabsContent>

        <TabsContent value="entidades" className="mt-6 space-y-4">
          {entidades.map((item) => (
            <ContentCard
              key={item.slug}
              title={item.nome}
              slug={item.slug}
              type="entidade"
              defaultImage={item.imageUrl}
              currentImage={settings.find(s => s.type === 'entidade' && s.slug === item.slug)?.image_url}
              onSave={handleSave}
              isSaving={saving === `entidade-${item.slug}`}
            />
          ))}
        </TabsContent>

        <TabsContent value="site" className="mt-6 space-y-4">
          {[
            { title: "Ícone de Estudos", slug: "estudos-icon" },
            { title: "Ícone de Orixás", slug: "orixas-icon" },
            { title: "Ícone de Entidades", slug: "entidades-icon" },
            { title: "Ícone de Esquerda", slug: "esquerda-icon" },
            { title: "Ícone de Orações", slug: "oracoes-icon" },
            { title: "Ícone de Conselhos", slug: "conselhos-icon" },
          ].map((asset) => (
            <ContentCard
              key={asset.slug}
              title={asset.title}
              slug={asset.slug}
              type="site_asset"
              defaultImage={asset.slug === 'orixas-icon' ? "https://lovasiri.com.br/api/i/nhorr5qhw8.jpg" : ""}
              currentImage={settings.find(s => s.type === 'site_asset' && s.slug === asset.slug)?.image_url}
              onSave={handleSave}
              isSaving={saving === `site_asset-${asset.slug}`}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentCard({ title, slug, type, defaultImage, currentImage, onSave, isSaving }: any) {
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (currentImage || defaultImage) {
      setUrl(currentImage || defaultImage || "");
    }
  }, [currentImage, defaultImage]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await uploadContentImage(file, `${type}-${slug}`);
      setUrl(publicUrl);
      toast.success("Upload concluído! Clique em salvar para confirmar.");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg border bg-muted flex items-center justify-center relative group">
            {url ? (
              <img src={url} alt={title} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">URL ou Upload</label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`file-${type}-${slug}`}
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    asChild
                  >
                    <label htmlFor={`file-${type}-${slug}`} className="cursor-pointer">
                      <Upload className="h-4 w-4" />
                    </label>
                  </Button>
                </div>
              </div>
            </div>
            <Button
              className="w-full sm:w-auto"
              disabled={isSaving || uploading}
              onClick={() => onSave(type, slug, url)}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? "Salvando..." : "Salvar Alteração"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
