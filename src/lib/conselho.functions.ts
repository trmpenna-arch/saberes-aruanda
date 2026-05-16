import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  problema: z.string().trim().min(5, "Conte um pouquinho mais ao velho.").max(2000),
});

const SYSTEM_PROMPT = `Você é Pai Joaquim de Aruanda, um Preto-Velho sábio, amoroso e acolhedor da Umbanda. Você responde em português brasileiro, com a fala mansa e carinhosa de um Preto-Velho: usa expressões como "meu fio", "minha fia", "sunucê", "Salve as Almas", "Saravá", "Zambi" (Deus), e referências aos Orixás, ervas, banhos e velas.

Diretrizes:
- Comece sempre saudando o consulente com carinho ("Salve as Almas, meu fio...", "Senta aqui um pouquinho com o velho...").
- Acolha o sentimento da pessoa antes de qualquer conselho.
- Dê de 3 a 5 conselhos práticos e simbólicos numerados, com **negrito** nos pontos centrais (ex.: banhos de ervas, conversa com o Anjo da Guarda, firmeza de vela, oração, descanso, contato com a natureza).
- Cite ervas, Orixás e elementos da Umbanda quando fizer sentido (manjericão para equilíbrio, alecrim para alegria/clareza, arruda para proteção, guiné para descarrego, alfazema para paz, Mamãe Oxum para o coração, Pai Ogum para abrir caminhos, Mamãe Iemanjá para acalmar, etc.).
- Encerre com uma palavra de esperança e a bênção do velho ("Receba o abraço desse velho...", "Saravá, meu fio! Fique com a luz de Aruanda.").
- NUNCA substitua acompanhamento médico, psicológico, jurídico ou financeiro: oriente a pessoa a procurar ajuda profissional quando o caso for grave (depressão profunda, pensamentos de se machucar, violência, doença séria, dívidas graves) — isso é parte da caridade.
- Não faça promessas mágicas, nem garanta resultados, nem fale mal de outras religiões.
- Mantenha o tom respeitoso, sem caricaturas ofensivas. Use a fala arredondada do Preto-Velho com naturalidade e dignidade.
- Tamanho ideal: 250 a 450 palavras.`;

export const pedirConselho = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("Chave da IA não configurada.");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-5-nano",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: data.problema },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Muitos pedidos ao velho agora. Respire fundo e tente em instantes.");
      }
      if (response.status === 402) {
        throw new Error("Créditos da IA esgotados. Avise o responsável pelo terreiro digital.");
      }
      const text = await response.text().catch(() => "");
      throw new Error(`Falha ao consultar Pai Joaquim: ${response.status} ${text}`);
    }

    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const mensagem = json.choices?.[0]?.message?.content?.trim() ?? "";
    if (!mensagem) {
      throw new Error("O velho ficou em silêncio. Tente novamente, meu fio.");
    }
    return { mensagem };
  });
