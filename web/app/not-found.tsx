import Link from "next/link"

import { StatusScreen } from "@/components/landing/status-screen"

export default function NotFound() {
  return (
    <StatusScreen
      code="Erro 404"
      title="Página não encontrada"
      description="A página que você procura não existe, foi movida ou o link está incorreto."
    >
      <Link href="/" className="btn">
        Voltar para a Home
      </Link>
    </StatusScreen>
  )
}
