import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { cn } from "@/lib/utils"

import type { Message } from "./types"

/** Estilos compactos pros elementos de markdown dentro da bolha do bot. */
const MD_COMPONENTS: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-ds-ink">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ds-orange underline underline-offset-2"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="rounded bg-black/30 px-1 py-0.5 text-[12px] [font-family:var(--font-mono)]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-2 overflow-x-auto rounded-lg bg-black/30 p-2.5 text-[12px] last:mb-0 [font-family:var(--font-mono)]">
      {children}
    </pre>
  ),
  h1: ({ children }) => (
    <p className="mb-1 font-semibold text-ds-ink">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="mb-1 font-semibold text-ds-ink">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="mb-1 font-semibold text-ds-ink">{children}</p>
  ),
}

export function MessageBubble({
  role,
  content,
}: Pick<Message, "role" | "content">) {
  const isUser = role === "user"
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed",
          isUser
            ? "rounded-2xl rounded-br-md bg-gradient-to-b from-[#ff7a4d] to-[#e85620] font-medium whitespace-pre-wrap text-[#1c0f07]"
            : "rounded-2xl rounded-bl-md border border-ds-line bg-ds-bg-2 text-ds-ink",
        )}
      >
        {isUser ? (
          content
        ) : (
          <Markdown remarkPlugins={[remarkGfm]} components={MD_COMPONENTS}>
            {content}
          </Markdown>
        )}
      </div>
    </div>
  )
}
