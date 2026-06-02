import { Fragment, type ReactNode } from "react"

import type { BlogBlock } from "@/lib/blog-posts"

// Parser mínimo de **negrito** — mantém o texto dos posts legível no array TS
// sem trazer uma lib de markdown. Divide em pares de `**` e envolve em <strong>.
function renderInline(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i}>{part}</strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      return <h2 className="blog-h2">{renderInline(block.text)}</h2>
    case "paragraph":
      return <p className="blog-p">{renderInline(block.text)}</p>
    case "list": {
      const items = block.items.map((item, i) => (
        <li key={i}>{renderInline(item)}</li>
      ))
      return block.ordered ? (
        <ol className="blog-list blog-list--ordered">{items}</ol>
      ) : (
        <ul className="blog-list">{items}</ul>
      )
    }
    case "callout":
      return (
        <aside className="blog-callout">
          {block.title ? (
            <div className="blog-callout-title">{block.title}</div>
          ) : null}
          <p>{renderInline(block.text)}</p>
        </aside>
      )
    case "stat":
      return (
        <div className="blog-stat">
          <span className="blog-stat-value">{renderInline(block.value)}</span>
          <span className="blog-stat-label">{renderInline(block.label)}</span>
        </div>
      )
    case "quote":
      return (
        <blockquote className="blog-quote">
          <p>{renderInline(block.text)}</p>
          {block.cite ? <cite>{block.cite}</cite> : null}
        </blockquote>
      )
  }
}

export function BlogBlocks({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="blog-body">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  )
}
