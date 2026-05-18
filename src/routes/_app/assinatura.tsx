import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Check, ShieldCheck, CreditCard, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PLANS = [
  {
    id: "gratis",
    name: "Grátis",
    price: "R$ 0",
    description: "Acesso aos conteúdos básicos e fundamentos.",
    features: ["Acesso a módulos iniciantes", "Orações básicas", "Conselhos diários"],
    buttonText: "Plano Atual",
    active: true,
  },
  {
    id: "premium_mensal",
    name: "Premium Mensal",
    price: "R$ 29,90",
    period: "/mês",
    description: "Acesso completo a todos os cursos e materiais avançados.",
    features: ["Todos os cursos premium", "Biblioteca completa", "Vídeos e áudios exclusivos", "Certificados de conclusão"],
    buttonText: "Assinar Mensal",
    highlight: false,
  },
  {
    id: "premium_anual",
    name: "Premium Anual",
    price: "R$ 299,90",
    period: "/ano",
    description: "Economize 2 meses com o plano anual.",
    features: ["Tudo do plano mensal", "2 meses grátis", "Prioridade em novos conteúdos"],
    buttonText: "Assinar Anual",
    highlight: true,
  }
];

export const Route = createFileRoute("/_app/assinatura")({
  component: SubscriptionManagement,
});

function SubscriptionManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ["assinatura", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assinaturas")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const updateSubscription = useMutation({
    mutationFn: async (_newPlan: string) => {
      throw new Error(
        "A ativação de assinaturas Premium ocorre apenas após pagamento confirmado. Use o checkout para assinar.",
      );
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const cancelSubscription = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) return;

      const { error } = await supabase.rpc("request_subscription_cancellation");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assinatura"] });
      toast.success("Cancelamento solicitado. Você manterá o acesso até o final do período.");
    },
    onError: (error: any) => {
      toast.error("Erro ao solicitar cancelamento: " + error.message);
    }
  });

  if (loading || subLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <ShieldCheck className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-serif font-bold mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground mb-6">Você precisa estar logado para gerenciar sua assinatura.</p>
        <Button onClick={() => navigate({ to: "/conta" })}>Ir para Login</Button>
      </div>
    );
  }

  const currentPlanId = subscription?.plano || "gratis";
  const isPremium = !!subscription?.ativa && currentPlanId !== "gratis";

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/conta" })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold">Assinatura</h1>
          <p className="text-sm text-muted-foreground">Gerencie seu plano e pagamentos</p>
        </div>
      </header>

      {/* Status Atual */}
      <Card className="border-gold/20 shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Status da Conta</CardTitle>
            <Badge variant={isPremium ? "default" : "secondary"} className={isPremium ? "bg-gold text-white" : ""}>
              {isPremium ? "Premium" : "Gratuito"}
            </Badge>
          </div>
          <CardDescription>
            {isPremium 
              ? `Seu plano ${PLANS.find(p => p.id === currentPlanId)?.name} está ativo.` 
              : "Você está usando a versão gratuita limitada."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isPremium ? 'bg-gold/10 text-gold' : 'bg-muted text-muted-foreground'}`}>
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">{isPremium ? "Acesso Total Liberado" : "Acesso Limitado"}</p>
              <p className="text-sm text-muted-foreground">
                {isPremium 
                  ? "Você tem acesso a todos os cursos, biblioteca e materiais exclusivos." 
                  : "Assine um plano premium para liberar todo o conhecimento."}
              </p>
            </div>
          </div>

          {subscription?.cancelamento_solicitado && (
            <div className="mt-4 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-600">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold">Cancelamento em processamento</p>
                <p>Sua assinatura foi cancelada e não será renovada. Você continuará com acesso premium até o final do período vigente.</p>
              </div>
            </div>
          )}
        </CardContent>
        {isPremium && !subscription?.cancelamento_solicitado && (
          <CardFooter className="flex justify-end gap-3 border-t bg-muted/10 pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (confirm("Tem certeza que deseja cancelar sua assinatura? Você manterá o acesso até o fim do período pago.")) {
                  cancelSubscription.mutate();
                }
              }}
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
              Cancelar Assinatura
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Planos Disponíveis */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold">Escolha seu Plano</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isDowngrade = plan.id === "gratis" && isPremium;
            
            return (
              <Card key={plan.id} className={`flex flex-col relative overflow-hidden transition-all hover:shadow-md ${plan.highlight ? 'border-gold shadow-gold/20 ring-1 ring-gold/20' : 'border-border'}`}>
                {plan.highlight && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gold text-white text-[10px] font-bold uppercase py-1 px-3 rounded-bl-lg">
                      Melhor Valor
                    </div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2 min-h-[40px]">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full rounded-full ${plan.highlight ? 'bg-gold hover:bg-gold/90 text-white' : ''}`}
                    variant={isCurrent ? "outline" : (plan.id === 'gratis' ? "ghost" : "default")}
                    disabled={isCurrent || updateSubscription.isPending || (isDowngrade && plan.id !== "gratis")}
                    onClick={() => {
                      if (plan.id === "gratis") return;
                      updateSubscription.mutate(plan.id);
                    }}
                  >
                    {updateSubscription.isPending && !isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : isCurrent ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : null}
                    {isCurrent ? "Plano Atual" : (isDowngrade ? "Já possui Premium" : plan.buttonText)}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Adicional */}
      <div className="rounded-2xl bg-sky-soft p-6 border border-gold/10">
        <div className="flex items-start gap-4">
          <CreditCard className="h-6 w-6 text-primary flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">Pagamento Seguro</h4>
            <p className="text-sm text-muted-foreground">
              Suas transações são protegidas e criptografadas. Aceitamos cartões de crédito, PIX e boleto (no plano anual).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
