import Link from "next/link"
import type { ReactNode } from "react"

// Telas de status (erro 500, 404...) no mesmo "frame" da landing:
// trilhos hachurados (.page), container central com bordas (.frame),
// crosshairs de canto (.corner) e logo real (K + KORI) clicável.
export function StatusScreen({
  code,
  title,
  description,
  refId,
  children,
}: {
  code: string
  title: string
  description: string
  refId?: string
  children: ReactNode
}) {
  return (
    <div className="landing">
      <div className="page">
        <div className="frame status-frame">
          <span className="corner tl" aria-hidden="true" />
          <span className="corner tr" aria-hidden="true" />
          <span className="corner bl" aria-hidden="true" />
          <span className="corner br" aria-hidden="true" />

          <main className="status-screen">
            <Link href="/" className="nav-brand status-brand" aria-label="Kori — início">
              <svg className="k" aria-hidden="true">
                <use href="#kori-k" />
              </svg>
              <span className="word">KORI</span>
            </Link>

            <div className="status-body">
              <span className="status-code">{code}</span>
              <h1 className="status-title">{title}</h1>
              <p className="status-desc">{description}</p>
              {refId ? <span className="status-ref">ref: {refId}</span> : null}
            </div>

            <div className="status-actions">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
