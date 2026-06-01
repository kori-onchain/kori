import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DemoStage } from "@/components/demo/demo-stage"
import "./demo.css"

export const metadata: Metadata = {
  title: "Demo · Kori",
  description: "Ambiente de demonstração do Kori — investidor, pessoa e loja.",
}

export default function DemoPage() {
  return (
    <div className="landing">
      <main className="demo-stage-page">
        <div className="demo-ambient" aria-hidden="true" />

        <Button
          asChild
          variant="ghost"
          className="demo-back h-auto gap-1.5 rounded-[11px] border border-ds-line bg-ds-bg-1 px-3.5 py-2 text-[12.5px] font-semibold text-ds-ink"
        >
          <Link href="/">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Voltar
          </Link>
        </Button>

        <span className="demo-corner-tag">
          <span className="dot" /> ambiente de demonstração
        </span>

        <DemoStage />
      </main>
    </div>
  )
}
