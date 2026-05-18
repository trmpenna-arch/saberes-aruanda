import { Database } from "@/integrations/supabase/types";
import { createServerFn } from "@tanstack/react-start";

// Tipos baseados no schema do Paddle
interface PaddleWebhookPayload {
  event_type: string;
  data: any;
}

export const paymentsWebhookHandler = createServerFn({ method: "POST" })
  .handler(async () => {
    // Importação dinâmica para usar utilitários da vinxi apenas no servidor
    const { getEvent, readBody } = await import("vinxi/http");
    const event = getEvent();
    
    if (!event) {
      return { success: false, error: "No event context" };
    }

    const payload = await readBody(event) as PaddleWebhookPayload;
    const req = (event as any).node?.req || (event as any).req;
    const headers = req?.headers || {};
    const url = new URL(req?.url || "", `http://${headers.host || 'localhost'}`);
    const env = url.searchParams.get("env") || "sandbox";
    
    console.log(`Recebido webhook do Paddle (${env}):`, payload.event_type);

    if (payload.event_type === "transaction.completed") {
      const { custom_data, amount, status } = payload.data;
      
      if (custom_data?.courseId && custom_data?.userId && status === "completed") {
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
