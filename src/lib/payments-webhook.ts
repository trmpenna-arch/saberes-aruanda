import { Database } from "@/integrations/supabase/types";
import { createServerFn } from "@tanstack/react-start";
import type Stripe from "stripe";

// Tipos baseados no schema do Paddle
interface PaddleWebhookPayload {
  event_type: string;
  data: any;
}

export const paymentsWebhookHandler = createServerFn({ method: "POST" })
  .handler(async () => {
    const { getEvent, readBody, readRawBody } = await import("vinxi/http");
    const event = getEvent();
    
    if (!event) {
      return { success: false, error: "No event context" };
    }

    const req = (event as any).node?.req || (event as any).req;
    const headers = req?.headers || {};
    const signature = headers['stripe-signature'];

    // Se tiver assinatura do Stripe, processa como Stripe
    if (signature) {
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const rawBody = await readRawBody(event);
        
        const stripeEvent = stripe.webhooks.constructEvent(
          rawBody!,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET!
        );

        console.log(`Recebido webhook do Stripe:`, stripeEvent.type);

        const { createClient } = await import("@supabase/supabase-js");
        const supabaseAdmin = createClient<Database>(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        switch (stripeEvent.type) {
          case 'checkout.session.completed': {
            const session = stripeEvent.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const courseId = session.metadata?.courseId;

            if (userId && courseId) {
              await supabaseAdmin
                .from("course_purchases")
                .upsert({
                  user_id: userId,
                  course_id: courseId,
                  amount_cents: session.amount_total || 0,
                  status: "completed",
                }, { onConflict: "user_id,course_id" });
              
              console.log(`Compra Stripe registrada: User ${userId}, Course ${courseId}`);
            }
            break;
          }
          case 'customer.subscription.created':
          case 'customer.subscription.updated': {
            const subscription = stripeEvent.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId;
            
            if (userId) {
              await supabaseAdmin
                .from("assinaturas")
                .upsert({
                  user_id: userId,
                  ativa: subscription.status === 'active',
                  updated_at: new Date().toISOString(),
                }, { onConflict: "user_id" });
              
              console.log(`Assinatura Stripe atualizada: User ${userId}, Status ${subscription.status}`);
            }
            break;
          }
          case 'customer.subscription.deleted': {
            const subscription = stripeEvent.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId;
            
            if (userId) {
              await supabaseAdmin
                .from("assinaturas")
                .update({ ativa: false, updated_at: new Date().toISOString() })
                .eq("user_id", userId);
              
              console.log(`Assinatura Stripe cancelada: User ${userId}`);
            }
            break;
          }
        }
        return { success: true };
      } catch (err: any) {
        console.error(`Erro no webhook do Stripe: ${err.message}`);
        return { success: false, error: err.message };
      }
    }

    // Caso contrário, processa como Paddle
    const payload = await readBody(event) as PaddleWebhookPayload;
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
          console.error("Erro ao registrar compra Paddle:", error);
          return { success: false, error: error.message };
        }
        
        console.log(`Compra Paddle registrada: User ${custom_data.userId}`);
      }
    }

    return { success: true };
  });
