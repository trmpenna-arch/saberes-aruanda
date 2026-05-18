import { Database } from "@/integrations/supabase/types";
import { createServerFn } from "@tanstack/react-start";
import { getEvent } from "vinxi/http";

// Tipos baseados no schema do Paddle (pode ser expandido conforme necessário)
interface PaddleWebhookPayload {
  event_type: string;
  data: any;
}

export const paymentsWebhookHandler = createServerFn("POST", async (payload: PaddleWebhookPayload) => {
  const event = getEvent();
  const url = new URL(event.node.req.url || "", `http://${event.node.req.headers.host}`);
  const env = url.searchParams.get("env") || "sandbox";
  
  console.log(`Recebido webhook do Paddle (${env}):`, payload.event_type);

  // Aqui você deve validar a assinatura do webhook usando o PAYMENTS_WEBHOOK_SECRET
  // Por simplicidade neste exemplo, focamos na lógica de negócio

  if (payload.event_type === "transaction.completed") {
    const { custom_data, amount, status } = payload.data;
    
    if (custom_data?.courseId && custom_data?.userId && status === "completed") {
      // Importação dinâmica para evitar problemas de escopo no servidor
      const { createClient } = await import("@supabase/supabase-js");
      
      const supabaseAdmin = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error } = await supabaseAdmin
        .from("course_purchases")
        .upsert({
          user_id: custom_data.userId,
          course_id: custom_data.courseId,
          amount_cents: parseInt(amount),
          status: "completed",
        }, { onConflict: "user_id,course_id" });

      if (error) {
        console.error("Erro ao registrar compra:", error);
        return { success: false, error: error.message };
      }
      
      console.log(`Compra registrada com sucesso para o usuário ${custom_data.userId}`);
    }
  }

  return { success: true };
});
