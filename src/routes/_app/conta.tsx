import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { orixas, estudos, esquerda, entidades } from "@/data/content";
import { getContentSettings, updateContentSetting, uploadContentImage } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Image as ImageIcon, Upload, UserPlus, Trash2, ShieldCheck, Mail, Lock, LogIn, LogOut } from "lucide-react";

export const Route = createFileRoute("/_app/conta")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkAdmin(session.user.email);
      } else {
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkAdmin(session.user.email);
      } else {
        setIsAdmin(null);
        setAuthLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdmin = async (userEmail: string | undefined) => {
    if (!userEmail) {
      setIsAdmin(false);
      setAuthLoading(false);
      return;
    }
    try {
      const { data } = await supabase
        .from('admins')
        .select('email')
        .eq('email', userEmail)
        .maybeSingle();
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin:", error);
      setIsAdmin(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao entrar");
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.info("Você saiu do painel.");
  };

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[70vh] items-center justify-center px-6">
        <Card className="w-full max-w-md border-gold/20 shadow-soft">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
              <LogIn className="h-6 w-6" />
            </div>
            <CardTitle className="font-serif text-2xl">Acesso ao Painel</CardTitle>
            <CardDescription>
              Entre com sua conta administrativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="E-mail"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Senha"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={signingIn}>
                {signingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center px-6">
        <div className="mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Acesso Restrito</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Sua conta ({session.user.email}) não possui permissão de administrador.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button variant="outline" className="rounded-full" onClick={handleSignOut}>
            Entrar com outra conta
          </Button>
          <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
            Voltar para o Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <header className="flex items-center justify-between">
        <div className="flex-1 text-center">
          <h1 className="font-serif text-3xl font-bold">Painel de Conteúdo</h1>
          <p className="text-sm text-muted-foreground">Gerencie imagens e acessos</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sair">
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </Button>
      </header>

      <AdminPanel />
    </div>
  );
}

function AdminPanel() {
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
      toast.error("Erro ao carregar configurações.");
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
      <div className="flex h-[30vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="orixas" className="w-full">
      <TabsList className="grid w-full grid-cols-4 sm:grid-cols-6">
        <TabsTrigger value="orixas">Orixás</TabsTrigger>
        <TabsTrigger value="estudos">Estudos</TabsTrigger>
        <TabsTrigger value="esquerda">Esquerda</TabsTrigger>
        <TabsTrigger value="entidades">Entidades</TabsTrigger>
        <TabsTrigger value="site">Site</TabsTrigger>
        <TabsTrigger value="admins">Admins</TabsTrigger>
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
            defaultImage=""
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

      <TabsContent value="admins" className="mt-6 space-y-4">
        <AdminManager />
      </TabsContent>
    </Tabs>
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

function AdminManager() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: true });
    if (error) {
      toast.error("Erro ao carregar administradores");
    } else {
      setAdmins(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleAddAdmin = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast.error("Insira um e-mail válido");
      return;
    }
    setAdding(true);
    const { error } = await supabase.from('admins').insert({ email: newEmail.toLowerCase().trim() });
    if (error) {
      toast.error("Erro ao adicionar: " + error.message);
    } else {
      toast.success("Administrador adicionado");
      setNewEmail("");
      loadAdmins();
    }
    setAdding(false);
  };

  const handleRemoveAdmin = async (id: string, email: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email === email) {
      toast.error("Você não pode remover seu próprio acesso");
      return;
    }

    if (!confirm(`Deseja remover ${email} dos administradores?`)) return;

    const { error } = await supabase.from('admins').delete().eq('id', id);
    if (error) {
      toast.error("Erro ao remover: " + error.message);
    } else {
      toast.success("Administrador removido");
      loadAdmins();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Gerenciar Acessos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input 
            placeholder="novo-admin@email.com" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button onClick={handleAddAdmin} disabled={adding}>
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
            Adicionar
          </Button>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Lista de Administradores</h4>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="divide-y border rounded-lg">
              {admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3">
                  <span className="text-sm">{admin.email}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
