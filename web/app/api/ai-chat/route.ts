import type { NextRequest } from "next/server"

import type { Message } from "@/components/ai-drawer/types"
import { hasProvider, streamReply } from "@/lib/ai/providers"

/**
 * Chat da IA da landing.
 *
 * O <AiDrawer /> faz POST aqui com { message, history } e lê a resposta como
 * stream de texto, preenchendo a bolha conforme chega.
 *
 * Cadeia de providers em lib/ai/providers.ts (Gemini → Groq). Sem nenhuma
 * chave no .env, cai num placeholder em streaming (mantém o demo funcionando).
 *
 * Para rodar de verdade, configure no .env.local (veja .env.example):
 *   GEMINI_API_KEY=...                 # https://aistudio.google.com/apikey
 *   GROQ_API_KEY=...                   # opcional, fallback
 *
 * TODO: rota pública sem rate-limit por enquanto. Antes de produção,
 * adicionar limite por IP (ex.: Upstash Redis) pra evitar abuso.
 */

// Edge dá melhor TTFB de streaming. Se seu host não suportar, troque por "nodejs".
export const runtime = "edge"

const MAX_INPUT = 500

type Body = {
  message?: string
  history?: Message[]
}

async function* placeholderStream(message: string): AsyncGenerator<string> {
  const reply =
    `🛈 Placeholder — nenhuma IA conectada. Você perguntou: "${message}". ` +
    `Configure GEMINI_API_KEY no .env.local para ativar as respostas reais.`
  for (const word of reply.split(" ")) {
    yield word + " "
    await new Promise((r) => setTimeout(r, 25))
  }
}

export async function POST(req: NextRequest) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return new Response("Corpo inválido.", { status: 400 })
  }

  const message = (body.message ?? "").toString().slice(0, MAX_INPUT).trim()
  if (!message) {
    return new Response("Mensagem vazia.", { status: 400 })
  }

  const history = Array.isArray(body.history) ? body.history : []
  const source = hasProvider()
    ? streamReply(message, history)
    : placeholderStream(message)

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of source) {
          controller.enqueue(encoder.encode(chunk))
        }
      } catch (error) {
        console.error("[ai] erro no streaming", error)
        controller.enqueue(
          encoder.encode("Ocorreu um erro ao gerar a resposta."),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
