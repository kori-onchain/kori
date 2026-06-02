import "server-only" // garante: nunca entra num bundle client (chaves protegidas)

import OpenAI from "openai"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions"

import type { Message } from "@/components/ai-drawer/types"

import { KORI_SYSTEM_PROMPT } from "./kori-context"

/**
 * Cadeia de fallback entre providers grátis com endpoint OpenAI-compatible.
 * Mesmo SDK, só muda baseURL + key + model. Tenta um por um; cai pro
 * próximo em erro/429. Só entram na cadeia os que têm a chave no .env.
 */
type ProviderConfig = {
  name: string
  baseURL: string
  apiKey: string | undefined
  model: string
  /** Params extras específicos do provider (merge no create). */
  extra?: Record<string, unknown>
}

const CANDIDATES: ProviderConfig[] = [
  {
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash",
    // 2.5 Flash é "thinking" por padrão e o raciocínio consome o max_tokens,
    // truncando a resposta visível. "none" desliga o thinking.
    extra: { reasoning_effort: "none" },
  },
  {
    name: "groq",
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
  },
]

const PROVIDERS = CANDIDATES.filter(
  (p): p is ProviderConfig & { apiKey: string } => Boolean(p.apiKey),
)

/** Há pelo menos um provider configurado? */
export function hasProvider(): boolean {
  return PROVIDERS.length > 0
}

const HISTORY_TURNS = 6 // últimas N mensagens enviadas como contexto

const FALLBACK =
  "Não consigo responder agora — todos os provedores de IA estão indisponíveis. Tente de novo em instantes."

/**
 * Gera a resposta em streaming, percorrendo a cadeia de providers.
 * Yields pedaços de texto conforme chegam.
 */
export async function* streamReply(
  message: string,
  history: Message[] = [],
): AsyncGenerator<string> {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: KORI_SYSTEM_PROMPT },
    ...history.slice(-HISTORY_TURNS).map(
      (m): ChatCompletionMessageParam => ({
        role: m.role,
        content: m.content,
      }),
    ),
    { role: "user", content: message },
  ]

  for (const provider of PROVIDERS) {
    try {
      const client = new OpenAI({
        apiKey: provider.apiKey,
        baseURL: provider.baseURL,
      })
      const stream = await client.chat.completions.create({
        model: provider.model,
        messages,
        stream: true,
        max_tokens: 1500,
        temperature: 0.3,
        ...provider.extra,
      })

      let emitted = false
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content
        if (delta) {
          emitted = true
          yield delta
        }
      }
      if (emitted) return // sucesso → encerra a cadeia
    } catch (error) {
      console.warn(`[ai] provider "${provider.name}" falhou, tentando próximo`, error)
      continue
    }
  }

  yield FALLBACK
}
