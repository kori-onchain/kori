export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

/**
 * O envio pode resolver para:
 *  - `string`            → renderiza a resposta de uma vez
 *  - `ReadableStream<string>` → preenche a bolha do bot conforme o texto chega
 */
export type SendResult = string | ReadableStream<string>

export type SendMessage = (
  message: string,
  history: Message[],
) => Promise<SendResult>

export type Topic = {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  /** Pergunta que o tópico "semeia" no mesmo fluxo de onSendMessage. */
  seed: string
}
