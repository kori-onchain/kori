"use client"

import { useCallback, useEffect, useReducer, useRef } from "react"
import { Cpu, Globe, Smartphone, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { Composer } from "./Composer"
import { DrawerTrigger } from "./DrawerTrigger"
import { MessageBubble } from "./MessageBubble"
import { ScrollTopButton } from "./ScrollTopButton"
import { TopicCard } from "./TopicCard"
import { TypingDots } from "./TypingDots"
import type { Message, SendMessage, SendResult, Topic } from "./types"

/* ------------------------------------------------------------------ */
/* Tópicos — só "semeiam" a 1ª pergunta no mesmo fluxo de onSendMessage */
/* ------------------------------------------------------------------ */
const TOPICS: Topic[] = [
  {
    id: "app",
    icon: <Smartphone className="size-[18px]" />,
    title: "Usando o app",
    subtitle: "Saldo, enviar, receber, NFTs",
    seed: "Como eu uso o app da Kori no dia a dia? Saldo, enviar, receber e NFTs.",
  },
  {
    id: "under-the-hood",
    icon: <Cpu className="size-[18px]" />,
    title: "Por baixo do capô",
    subtitle: "Stack, rede e arquitetura",
    seed: "Como a Kori funciona por baixo do capô? Stack, rede e arquitetura.",
  },
  {
    id: "ecosystem",
    icon: <Globe className="size-[18px]" />,
    title: "Ecossistema",
    subtitle: "Visão, parceiros e roadmap",
    seed: "Me conta sobre o ecossistema da Kori: visão, parceiros e roadmap.",
  },
]

/* ------------------------------------------------------------------ */
/* Estado                                                              */
/* ------------------------------------------------------------------ */
type View = "topics" | "chat"

type State = {
  open: boolean
  view: View
  messages: Message[]
  typing: boolean
  /** id da mensagem do bot sendo revelada (typewriter) — null quando ocioso. */
  streamingId: string | null
}

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "GO_CHAT" }
  | { type: "ADD"; message: Message }
  | { type: "PATCH"; id: string; content: string }
  | { type: "TYPING"; value: boolean }
  | { type: "STREAM"; id: string | null }

const initialState: State = {
  open: false,
  view: "topics",
  messages: [],
  typing: false,
  streamingId: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true }
    case "CLOSE":
      return { ...state, open: false }
    case "GO_CHAT":
      return { ...state, view: "chat" }
    case "ADD":
      return { ...state, messages: [...state.messages, action.message] }
    case "PATCH":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, content: action.content } : m,
        ),
      }
    case "TYPING":
      return { ...state, typing: action.value }
    case "STREAM":
      return { ...state, streamingId: action.id }
    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
export type AiDrawerProps = {
  /** Plugue sua API aqui. Tem prioridade sobre `endpoint`. */
  onSendMessage?: SendMessage
  /** Route handler alternativo (default: /api/ai-chat) usado se `onSendMessage` não for passado. */
  endpoint?: string
  /** Rótulo do botão de gatilho. */
  triggerLabel?: string
}

/* ------------------------------------------------------------------ */
/* Resolver de envio (agnóstico à IA, pronto pra streaming)            */
/* ------------------------------------------------------------------ */
const PLACEHOLDER =
  "🛈 Placeholder — a IA ainda não está conectada. Plugue `onSendMessage` (ou o route handler em /api/ai-chat) e este texto some."

function makeFallback(endpoint?: string): SendMessage {
  return async (message, history) => {
    if (!endpoint) return PLACEHOLDER
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
    })
    if (!res.ok || !res.body) {
      return res.ok ? await res.text() : PLACEHOLDER
    }
    // Converte o stream de bytes do route handler em stream de texto.
    return res.body.pipeThrough(new TextDecoderStream())
  }
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */
export function AiDrawer({
  onSendMessage,
  endpoint = "/api/ai-chat",
  triggerLabel = "Falar com a IA",
}: AiDrawerProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { open, view, messages, typing, streamingId } = state

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const idSeq = useRef(0)
  const sender = useRef<SendMessage>(onSendMessage ?? makeFallback(endpoint))

  // Mantém o resolver atualizado sem recriar callbacks.
  useEffect(() => {
    sender.current = onSendMessage ?? makeFallback(endpoint)
  }, [onSendMessage, endpoint])

  const nextId = (role: Message["role"]) => `${role}-${idSeq.current++}`

  const close = useCallback(() => dispatch({ type: "CLOSE" }), [])

  // Espelho do estado pra ler `messages` dentro de `send` sem recriá-lo.
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  /* ---- Envio (compartilhado por composer e tópicos) ---- */
  const send = useCallback(
    async (text: string) => {
      const history = stateRef.current.messages
      dispatch({ type: "ADD", message: { id: nextId("user"), role: "user", content: text } })
      dispatch({ type: "TYPING", value: true })

      const botId = nextId("assistant")
      let added = false
      try {
        const result: SendResult = await sender.current(text, history)
        dispatch({ type: "TYPING", value: false })
        dispatch({ type: "ADD", message: { id: botId, role: "assistant", content: "" } })
        added = true
        dispatch({ type: "STREAM", id: botId })

        // Buffer alvo: recebe o texto (string de uma vez ou stream em pedaços).
        let target = ""
        let finished = false
        const pump = (async () => {
          try {
            if (typeof result === "string") {
              target = result
              return
            }
            const reader = result.getReader()
            for (;;) {
              const { value, done } = await reader.read()
              if (done) break
              target += value
            }
          } finally {
            finished = true
          }
        })()

        // Revelação "typewriter": cadência constante, independente das rajadas
        // da rede. Acelera quando está muito atrás pra não acumular atraso.
        let shown = 0
        await new Promise<void>((resolve) => {
          const tick = () => {
            if (shown < target.length) {
              const remaining = target.length - shown
              const step = Math.max(1, Math.round(remaining / 9))
              shown = Math.min(target.length, shown + step)
              dispatch({ type: "PATCH", id: botId, content: target.slice(0, shown) })
            }
            if (finished && shown >= target.length) {
              resolve()
              return
            }
            window.setTimeout(tick, 16)
          }
          tick()
        })
        await pump
      } catch {
        dispatch({ type: "TYPING", value: false })
        const msg = "Não consegui responder agora. Tente de novo em instantes."
        if (added) {
          dispatch({ type: "PATCH", id: botId, content: msg })
        } else {
          dispatch({
            type: "ADD",
            message: { id: botId, role: "assistant", content: msg },
          })
        }
      } finally {
        dispatch({ type: "STREAM", id: null })
      }
    },
    [],
  )

  const handleTopic = useCallback(
    (topic: Topic) => {
      dispatch({ type: "GO_CHAT" })
      void send(topic.seed)
    },
    [send],
  )

  /* ---- Foco no input ao abrir ---- */
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 80)
    return () => window.clearTimeout(t)
  }, [open, view])

  /* ---- Esc fecha + scroll-lock do body ---- */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    // Trava o scroll do fundo no html E no body (o scroller varia por browser).
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [open, close])

  /* ---- Auto-scroll pro fim ---- */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, view])

  /* ---- Trap de foco simples (Tab cicla dentro do painel) ---- */
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      {/* Floaters (canto inferior direito): voltar-ao-topo + abrir chat.
          O pill fica ancorado à direita; o botão de subir entra à esquerda
          dele quando o usuário desce a página. */}
      <div className="fixed right-5 bottom-5 z-50 flex items-center gap-2.5">
        <ScrollTopButton />
        <DrawerTrigger
          label={triggerLabel}
          expanded={open}
          onClick={() => dispatch({ type: "OPEN" })}
        />
      </div>

      {/* Scrim */}
      <div
        onClick={close}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Kori — assistente"
        aria-hidden={!open}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "fixed inset-y-0 right-0 z-[61] flex w-[380px] max-w-[92vw] flex-col border-l border-ds-line-2 bg-ds-bg shadow-2xl shadow-black/50 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] max-[480px]:w-full max-[480px]:max-w-full",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <header className="flex flex-col gap-3 border-b border-ds-line bg-ds-bg-2 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-[#ff7a4d] to-[#e85620] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                aria-hidden="true"
              >
                <svg className="h-5 w-[18px] text-white">
                  <use href="#kori-k" />
                </svg>
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold tracking-tight text-ds-ink">
                  Kori
                </span>
                <span className="flex items-center gap-1.5 text-[10px] tracking-wide text-ds-dim uppercase [font-family:var(--font-mono)]">
                  <span className="size-1.5 rounded-full bg-ds-green" />
                  Assistente
                </span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={close}
              aria-label="Fechar"
              className="text-ds-dim hover:text-ds-ink"
            >
              <X className="size-4" />
            </Button>
          </div>
          <p className="text-[13px] leading-relaxed text-ds-dim">
            Sobre o que você quer saber? Escolha um tema ou pergunte direto
            abaixo.
          </p>
        </header>

        {/* Corpo */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"
        >
          {view === "topics" ? (
            <div className="flex flex-col gap-2">
              {TOPICS.map((t) => (
                <TopicCard key={t.id} topic={t} onSelect={handleTopic} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  streaming={m.id === streamingId}
                />
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-ds-line bg-ds-bg-2 px-4 py-3">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
        <footer className="border-t border-ds-line bg-ds-bg-2 px-4 py-3">
          <Composer ref={inputRef} disabled={typing} onSend={send} />
          <p className="mt-2.5 px-1 text-[11px] text-ds-mute">
            Enter para enviar · Esc para fechar
          </p>
        </footer>
      </aside>
    </>
  )
}
