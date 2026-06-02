"use client"

import { useEffect, useState } from "react"
import { Smartphone, Sparkles, TriangleAlert, X } from "lucide-react"

import { Button } from "@/components/ui/button"

const SEEN_KEY = "kori_web_preview_seen"

export function PreviewModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (sessionStorage.getItem(SEEN_KEY)) return
    const id = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const close = () => {
    sessionStorage.setItem(SEEN_KEY, "1")
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-[22px] border border-ds-line-2 bg-ds-elev shadow-[0_30px_80px_-24px_rgba(0,0,0,0.7)]">
        {/* glow header */}
        <div className="relative overflow-hidden border-b border-ds-line bg-gradient-to-b from-ds-orange/12 to-transparent px-7 pt-7 pb-5">
          <div className="absolute -top-10 -right-8 size-32 rounded-full bg-ds-orange/15 blur-3xl" />
          <button
            onClick={close}
            aria-label="Fechar"
            className="absolute top-4 right-4 rounded-lg p-1.5 text-ds-mute transition-colors hover:bg-ds-bg-2 hover:text-ds-ink"
          >
            <X className="size-4" />
          </button>

          <div className="relative flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-[12px] border border-ds-orange/25 bg-ds-orange/10 text-ds-orange">
              <Sparkles className="size-5" />
            </div>
            <span className="rounded-full border border-ds-orange/25 bg-ds-orange/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ds-orange">
              Web · Preview
            </span>
          </div>

          <h2 className="relative mt-4 text-[22px] font-bold leading-tight tracking-tight">
            Bem-vindo à Kori na web
          </h2>
          <p className="relative mt-1.5 text-[13px] leading-relaxed text-ds-dim">
            Esta é uma prévia do produto. A experiência completa — carteira,
            pagamentos e on-chain — funciona melhor no aplicativo.
          </p>
        </div>

        {/* body */}
        <div className="px-7 py-5">
          <ul className="flex flex-col gap-3">
            <li className="flex gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[9px] border border-ds-line bg-ds-bg-2 text-ds-orange">
                <Smartphone className="size-3.5" />
              </span>
              <div>
                <div className="text-[13px] font-semibold">Feito pra rodar no app</div>
                <div className="mt-0.5 text-[12px] leading-relaxed text-ds-mute">
                  Carteira embutida, biometria e liquidação on-chain são nativas do
                  aplicativo.
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[9px] border border-ds-line bg-ds-bg-2 text-ds-orange">
                <TriangleAlert className="size-3.5" />
              </span>
              <div>
                <div className="text-[13px] font-semibold">Muita coisa em preview</div>
                <div className="mt-0.5 text-[12px] leading-relaxed text-ds-mute">
                  Vários fluxos ainda estão em construção e podem não funcionar ou
                  usar dados de demonstração.
                </div>
              </div>
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-2.5">
            <Button
              onClick={close}
              className="h-auto w-full rounded-xl border-0 bg-ds-ink py-3 text-[13px] font-semibold text-ds-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_4px_12px_-6px_rgba(0,0,0,0.4)] hover:opacity-90"
            >
              Entendi, continuar
            </Button>
            <a
              href="/download"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-ds-line bg-ds-bg-1 py-3 text-[13px] font-semibold text-ds-ink no-underline transition-colors hover:border-ds-line-2"
            >
              <Smartphone className="size-3.5" />
              Baixar o app
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
