import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { Database } from "@/integrations/supabase/types";

interface PaddleWebhookPayload {
  event_type: string;
  data: any;
}

export const Route = createFileRoute("/api/public/payments-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const signature = request.headers.get("stripe-signature");
        const rawBody = await request.text();

        // Stripe path
        if (signature) {
          try {
            const { default: Stripe } = await import("stripe");
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
            const stripeEvent = stripe.webhooks.constructEvent(
              rawBody,
              signature,
              process.env.STRIPE_WEBHOOK_SECRET!,
            );

            const supabaseAdmin = createClient<Database>(
              process.env.SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!,
            );

            switch (stripeEvent.type) {
              case "checkout.session.completed": {
                const session = stripeEvent.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const courseId = session.metadata?.courseId;
                if (userId && courseId) {
                  await supabaseAdmin.from("course_purchases").upsert(
                    {
                      user_id: userId,
                      course_id: courseId,
                      amount_cents: session.amount_total || 0,
                      status: "completed",
                    },
                    { onConflict: "user_id,course_id" },
                  );
                }
                break;
              }
              case "customer.subscription.created":
              case "customer.subscription.updated": {
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.userId;
                if (userId) {
                  await supabaseAdmin.from("assinaturas").upsert(
                    {
                      user_id: userId,
                      ativa: subscription.status === "active",
                      updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id" },
                  );
                }
                break;
              }
              case "customer.subscription.deleted": {
                const subscription = stripeEvent.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.userId;
                if (userId) {
                  await supabaseAdmin
                    .from("assinaturas")
                    .update({ ativa: false, updated_at: new Date().toISOString() })
                    .eq("user_id", userId);
                }
                break;
              }
            }
            return new Response(JSON.stringify({ success: true }), {
              headers: { "content-type": "application/json" },
            });
          } catch (err: any) {
            console.error("Stripe webhook error");
            return new Response(JSON.stringify({ success: false }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }
        }

        // Paddle path — require signature verification
        try {
          const paddleSignature = request.headers.get("paddle-signature");
          if (!paddleSignature) {
            return new Response(JSON.stringify({ success: false, error: "missing signature" }), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }

          const url = new URL(request.url);
          const env = (url.searchParams.get("env") || "live") as "sandbox" | "live";
          const secret =
            env === "sandbox"
              ? process.env.PAYMENTS_SANDBOX_WEBHOOK_SECRET
              : process.env.PAYMENTS_LIVE_WEBHOOK_SECRET;
          if (!secret) {
            return new Response(JSON.stringify({ success: false, error: "secret not configured" }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          // Parse paddle-signature header: ts=...;h1=...
          const parts = Object.fromEntries(
            paddleSignature.split(";").map((p) => {
              const i = p.indexOf("=");
              return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
            }),
          );
          const ts = parts["ts"];
          const h1 = parts["h1"];
          if (!ts || !h1) {
            return new Response(JSON.stringify({ success: false, error: "invalid signature" }), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }

          const { createHmac, timingSafeEqual } = await import("crypto");
          const expected = createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");
          const a = Buffer.from(expected, "hex");
          const b = Buffer.from(h1, "hex");
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            return new Response(JSON.stringify({ success: false, error: "bad signature" }), {
              status: 401,
              headers: { "content-type": "application/json" },
            });
          }

          const payload = JSON.parse(rawBody) as PaddleWebhookPayload;
          if (payload.event_type === "transaction.completed") {
            const { custom_data, amount, status } = payload.data;
            if (custom_data?.courseId && custom_data?.userId && status === "completed") {
              const supabaseAdmin = createClient<Database>(
                process.env.SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
              );
              const { error } = await supabaseAdmin.from("course_purchases").upsert(
                {
                  user_id: custom_data.userId,
                  course_id: custom_data.courseId,
                  amount_cents: parseInt(amount),
                  status: "completed",
                },
                { onConflict: "user_id,course_id" },
              );
              if (error) {
                return new Response(JSON.stringify({ success: false }), {
                  status: 500,
                  headers: { "content-type": "application/json" },
                });
              }
            }
          }
          return new Response(JSON.stringify({ success: true }), {
            headers: { "content-type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ success: false }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
      },
    },
  },
});
