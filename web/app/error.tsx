"use client"

import Link from "next/link"
import { useEffect } from "react"

import { StatusScreen } from "@/components/landing/status-screen"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusScreen
      code="Erro 500"
      title="Algo deu errado"
      description="Tivemos um problema ao carregar esta página. Tente novamente em instantes."
      refId={error?.digest}
    >
      <button type="button" onClick={reset} className="btn">
        Tentar novamente
      </button>
      <Link href="/" className="btn btn-ghost">
        Voltar para a Home
      </Link>
    </StatusScreen>
  )
}
