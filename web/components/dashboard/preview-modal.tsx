"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

const POINTS = [
  {
    n: "01",
    t: "Feito pra rodar no app",
    d: "Carteira, biometria e liquidação on-chain são nativas do aplicativo.",
  },
  {
    n: "02",
    t: "Em preview",
    d: "Vários fluxos ainda estão em construção e usam dados de demonstração.",
  },
]

export function PreviewModal() {
  const [open, setOpen] = useState(false)

  // Sempre mostra ao entrar no dashboard (a cada carregamento).
  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const close = () => setOpen(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-[16px] border border-ds-line-2 bg-ds-elev shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]">
        {/* header */}
        <div className="flex items-center justify-between border-b border-ds-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <svg width={16} height={20} className="text-ds-ink">
              <use href="#kori-k" />
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ds-mute">
              Web · Preview
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Fechar"
            className="rounded-md p-1 text-ds-mute transition-colors hover:bg-ds-bg-2 hover:text-ds-ink"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* body */}
        <div className="px-5 py-5">
          <h2 className="text-[18px] font-bold tracking-tight">Bem-vindo à Kori na web</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ds-dim">
            Esta é uma prévia. A experiência completa — carteira, pagamentos e
            on-chain — funciona melhor no aplicativo.
          </p>

          <ul className="mt-5 flex flex-col divide-y divide-ds-line overflow-hidden rounded-[12px] border border-ds-line">
            {POINTS.map((p) => (
              <li key={p.n} className="flex gap-3 bg-ds-bg-1 px-4 py-3">
                <span className="mt-px font-mono text-[11px] font-semibold text-ds-orange">
                  {p.n}
                </span>
                <div>
                  <div className="text-[13px] font-semibold">{p.t}</div>
                  <div className="mt-0.5 text-[12px] leading-relaxed text-ds-mute">
                    {p.d}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={close}
              className="w-full rounded-[11px] bg-ds-ink py-3 text-[13px] font-semibold text-ds-bg transition-opacity hover:opacity-90"
            >
              Entendi, continuar
            </button>
            <a
              href="/download"
              className="w-full rounded-[11px] border border-ds-line bg-ds-bg-1 py-3 text-center text-[13px] font-semibold text-ds-ink no-underline transition-colors hover:border-ds-line-2"
            >
              Baixar o app
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
