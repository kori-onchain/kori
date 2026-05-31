"use client"

import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-7 bg-ds-bg px-6 text-center">
      <svg className="h-14 w-12 text-ds-orange" viewBox="420 260 310 370" aria-hidden="true">
        <use href="#kori-k" />
      </svg>

      <div className="flex flex-col items-center gap-3">
        <span className="font-mono text-xs tracking-[0.3em] text-ds-orange">
          ERRO 500
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-ds-ink">
          Algo deu errado
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ds-dim">
          Tivemos um problema ao carregar esta página. Tente novamente em
          instantes.
        </p>
        {error?.digest ? (
          <span className="font-mono text-[11px] text-ds-mute">
            ref: {error.digest}
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-ds-orange px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          className="rounded-xl border border-ds-line-2 px-5 py-3 text-sm font-semibold text-ds-ink transition-colors hover:bg-ds-elev"
        >
          Voltar para a Home
        </Link>
      </div>
    </main>
  )
}
